#!/usr/bin/php
<?php

if ($_SERVER['argc'] != 2 || in_array($_SERVER['argv'][1], array('help', '-h', '--help'))) {
	processHelp();
	exit(1);
}
$params = $_SERVER['argv'];
array_shift($params);
foreach ($params as $param) {
	if ($param == 'framework')
		processFramework();
	if ($param == 'application')
		processApplication();
	if ($param == 'loader')
		processLoader();
}

/** Concatenate and minify application's files. */
function processApplication() {
	$prefix = __DIR__ . '/../www';
	// read HTML file
	$htmlPath = "$prefix/index.html";
	$html = file_get_contents($htmlPath);
	// extract application loader
	preg_match('/sk-app-loader="([^"]*)"/', $html, $matches);
	if (!isset($matches[1]) || empty($matches[1])) {
		// no application loader
		return;
	}
	// read loader file
	$loaderPath = "$prefix/" . $matches[1];
	if (!file_exists($loaderPath)) {
		// loader file doesn't exist
		exit(2);
	}
	$loader = file_get_contents($loaderPath);
	$list = explode("\n", $loader);
	$result= "\"use strict\";\n";
	// process files
	foreach ($list as $path) {
		if (empty($path) || $path[0] == '#')
			continue;
		if (!file_exists("$prefix/$path")) {
			// file doesn't exist
			exit(3);
		}
		$content = file_get_contents("$prefix/$path");
		$content = str_replace('"use strict";', '', $content);
		$content = trim(JSMin::minify(trim($content)));
		$result .= "/* $path */\n$content\n";
	}
	// write application file
	if (file_put_contents("$prefix/_app.js", $result) === false) {
		// unable to write application file
		exit(4);
	}
	// update HTML file
	$html = str_replace('sk-app-loader="' . $matches[1] . '"', 'sk-app-file="_app.js"', $html);
	if (file_put_contents($htmlPath, $html) === false) {
		// unable to update HTML file
		exit(5);
	}
}

/** Concatenate and minify framework's files. */
function processFramework() {
	$prefix = __DIR__ . '/../www/js';
	$files = array(
		'polyfill-custom-element.js',
		'jquery.min.js',
		'smart.min.js',
		'skelement/sk.js',
		'skelement/sk.url.js',
		'skelement/sk._core.js',
		'skelement/sk._core.network.js',
		'skelement/sk._core.ui.js'
	);
	$result = '';
	foreach ($files as $file) {
		if (empty($file))
			continue;
		if (($content = file_get_contents("$prefix/$file")) === false) {
			// unable to read file
			exit(6);
		}
		$content = str_replace('"use strict";', '', $content);
		if (substr($file, -strlen('.min.js')) != '.min.js') {
			$content = JSMin::minify($content);
		}
		$result .= "/* $file */\n$content\n";
	}
	if (file_put_contents("$prefix/skelement-loader.js", $result) === false) {
		// unable to update loader file
		exit(7);
	}
}

/* Generate application loader. */
function processLoader() {
	$prefix = __DIR__ . '/../www';
	file_put_contents("$prefix/loader.txt", '');
	_processLoaderDir("$prefix/app", "$prefix/");
}
function _processLoaderDir($path, $prefix) {
	$files = scandir($path);
	foreach ($files as $file) {
		if ($file[0] == '.')
			continue;
		$fullpath = "$path/$file";
		if (is_file($fullpath) && substr($file, -3) == '.js') {
			if (substr($fullpath, 0, strlen($prefix)) == $prefix)
				$fullpath = substr($fullpath, strlen($prefix));
			file_put_contents(__DIR__ . '/../www/loader.txt', "$fullpath\n", FILE_APPEND);
		} else if (is_dir($fullpath)) {
			_processLoaderDir($fullpath, $prefix);
		}
	}
}

/** Show help message. */
function processHelp() {
	print(Ansi::bold($_SERVER['argv'][0]) . " [help | framework | application | loader]\n\n" .
	      "\t" . Ansi::faint("framework") . "\tConcatenate and minify framework's files.\n" .
	      "\t" . Ansi::faint("application") . "\tConcatenate and minify application's files.\n" .
	      "\t" . Ansi::faint("loader") . "\t\tGenerate application's loader.\n");
}

/* ----------------------------------------------------------------- */

class Ansi {
	static public $colors = array(
		'black'		=> 0,
		'red'		=> 1,
		'green'		=> 2,
		'yellow'	=> 3,
		'blue'		=> 4,
		'magenta'	=> 5,
		'cyan'		=> 6,
		'white'		=> 7
	);

	static public function bold($text) {
		return (chr(27) . "[1m" . $text . chr(27) . "[0m");
	}
	static public function faint($text) {
		return (chr(27) . "[2m" . $text . chr(27) . "[0m");
	}
	static public function underline($text) {
		return (chr(27) . "[4m" . $text . chr(27) . "[0m");
	}
	static public function negative($text) {
		return (chr(27) . "[7m" . $text . chr(27) . "[0m");
	}
	static public function color($color, $text) {
		return (chr(27) . "[9" . self::$colors[$color] . "m" . $text . chr(27) . "[0m");
	}
	static public function backColor($backColor, $color, $text) {
		return (chr(27) . "[4" . self::$colors[$backColor] . "m" . chr(27) . "[9" .
		        self::$colors[$color] . "m" . $text . chr(27) . "[0m");
	}
}

/* ----------------------------------------------------------------- */

/**
* jsmin.php - PHP implementation of Douglas Crockford's JSMin.
*
* This is pretty much a direct port of jsmin.c to PHP with just a few
* PHP-specific performance tweaks. Also, whereas jsmin.c reads from stdin and
* outputs to stdout, this library accepts a string as input and returns another
* string as output.
*
* PHP 5 or higher is required.
*
* Permission is hereby granted to use this version of the library under the
* same terms as jsmin.c, which has the following license:
*
* --
* Copyright (c) 2002 Douglas Crockford (www.crockford.com)
*
* Permission is hereby granted, free of charge, to any person obtaining a copy of
* this software and associated documentation files (the "Software"), to deal in
* the Software without restriction, including without limitation the rights to
* use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
* of the Software, and to permit persons to whom the Software is furnished to do
* so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* The Software shall be used for Good, not Evil.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
* --
*
* @package JSMin
* @author Ryan Grove <ryan@wonko.com>
* @copyright 2002 Douglas Crockford <douglas@crockford.com> (jsmin.c)
* @copyright 2008 Ryan Grove <ryan@wonko.com> (PHP port)
* @license http://opensource.org/licenses/mit-license.php MIT License
* @version 1.1.1 (2008-03-02)
* @link http://code.google.com/p/jsmin-php/
*/

class JSMin {
  const ORD_LF = 10;
  const ORD_SPACE = 32;

  protected $a = '';
  protected $b = '';
  protected $input = '';
  protected $inputIndex = 0;
  protected $inputLength = 0;
  protected $lookAhead = null;
  protected $output = '';

  // -- Public Static Methods --------------------------------------------------

  public static function minify($js) {
    $jsmin = new JSMin($js);
    return $jsmin->min();
  }

  // -- Public Instance Methods ------------------------------------------------

  public function __construct($input) {
    $this->input = str_replace("\r\n", "\n", $input);
    $this->inputLength = strlen($this->input);
  }

  // -- Protected Instance Methods ---------------------------------------------

  protected function action($d) {
    switch($d) {
      case 1:
        $this->output .= $this->a;

      case 2:
        $this->a = $this->b;

        if ($this->a === "'" || $this->a === '"') {
          for (;;) {
            $this->output .= $this->a;
            $this->a = $this->get();

            if ($this->a === $this->b) {
              break;
            }

            if (ord($this->a) <= self::ORD_LF) {
              throw new JSMinException('Unterminated string literal.');
            }

            if ($this->a === '\\') {
              $this->output .= $this->a;
              $this->a = $this->get();
            }
          }
        }

      case 3:
        $this->b = $this->next();

        if ($this->b === '/' && (
            $this->a === '(' || $this->a === ',' || $this->a === '=' ||
            $this->a === ':' || $this->a === '[' || $this->a === '!' ||
            $this->a === '&' || $this->a === '|' || $this->a === '?')) {

          $this->output .= $this->a . $this->b;

          for (;;) {
            $this->a = $this->get();

            if ($this->a === '/') {
              break;
            } elseif ($this->a === '\\') {
              $this->output .= $this->a;
              $this->a = $this->get();
            } elseif (ord($this->a) <= self::ORD_LF) {
              throw new JSMinException('Unterminated regular expression '.
                  'literal.');
            }

            $this->output .= $this->a;
          }

          $this->b = $this->next();
        }
    }
  }

  protected function get() {
    $c = $this->lookAhead;
    $this->lookAhead = null;

    if ($c === null) {
      if ($this->inputIndex < $this->inputLength) {
        $c = substr($this->input, $this->inputIndex, 1);
        $this->inputIndex += 1;
      } else {
        $c = null;
      }
    }

    if ($c === "\r") {
      return "\n";
    }

    if ($c === null || $c === "\n" || ord($c) >= self::ORD_SPACE) {
      return $c;
    }

    return ' ';
  }

  protected function isAlphaNum($c) {
    return ord($c) > 126 || $c === '\\' || preg_match('/^[\w\$]$/', $c) === 1;
  }

  protected function min() {
    $this->a = "\n";
    $this->action(3);

    while ($this->a !== null) {
      switch ($this->a) {
        case ' ':
          if ($this->isAlphaNum($this->b)) {
            $this->action(1);
          } else {
            $this->action(2);
          }
          break;

        case "\n":
          switch ($this->b) {
            case '{':
            case '[':
            case '(':
            case '+':
            case '-':
              $this->action(1);
              break;

            case ' ':
              $this->action(3);
              break;

            default:
              if ($this->isAlphaNum($this->b)) {
                $this->action(1);
              }
              else {
                $this->action(2);
              }
          }
          break;

        default:
          switch ($this->b) {
            case ' ':
              if ($this->isAlphaNum($this->a)) {
                $this->action(1);
                break;
              }

              $this->action(3);
              break;

            case "\n":
              switch ($this->a) {
                case '}':
                case ']':
                case ')':
                case '+':
                case '-':
                case '"':
                case "'":
                  $this->action(1);
                  break;

                default:
                  if ($this->isAlphaNum($this->a)) {
                    $this->action(1);
                  }
                  else {
                    $this->action(3);
                  }
              }
              break;

            default:
              $this->action(1);
              break;
          }
      }
    }

    return $this->output;
  }

  protected function next() {
    $c = $this->get();

    if ($c === '/') {
      switch($this->peek()) {
        case '/':
          for (;;) {
            $c = $this->get();

            if (ord($c) <= self::ORD_LF) {
              return $c;
            }
          }

        case '*':
          $this->get();

          for (;;) {
            switch($this->get()) {
              case '*':
                if ($this->peek() === '/') {
                  $this->get();
                  return ' ';
                }
                break;

              case null:
                throw new JSMinException('Unterminated comment.');
            }
          }

        default:
          return $c;
      }
    }

    return $c;
  }

  protected function peek() {
    $this->lookAhead = $this->get();
    return $this->lookAhead;
  }
}

// -- Exceptions ---------------------------------------------------------------
class JSMinException extends Exception {}


