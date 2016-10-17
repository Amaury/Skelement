var sk = new function() {
	this._templates = {};
	/**
	 * Traitement d'un template.
	 * @param	string		tag	Tag correspondant au composant.
	 * @param	string		tpl	Contenu du template.
	 * @param	hash		data	Tableau de données.
	 * @param	function	handler	Fonction à exécuter en lui passant en paramètre le HTML généré.
	 */
	this.render = function(tag, tpl, data, handler) {
		// récupération du template et création de l'interpréteur jSmart si nécessaire
		if (!this._templates[tag]) {
			// récupération du template
			if (tpl == undefined || tpl == "") {
				tpl = $("script#tpl-" + tag).html();
			} else if (typeof tpl == "object" && tpl.id != undefined) {
				tpl = $("script#tpl-" + tpl.id).html();
			} else if (typeof tpl == "string" && (tpl.substr(0, 7) == "http://" || tpl.substr(0, 8) == "https://" || tpl.substr(0, 7) == "file://")) {
				$.get(tpl, function(response) {
					sk.render(tag, response, data, handler);
				}, "text");
				return;
			} else if (typeof tpl == "object" && tpl.url != undefined) {
				$.get(tpl.url, function(response) {
					sk.render(tag, response, data, handler);
				}, "text");
				return;
			}
			// création de l'interpréteur jSmart
			this._templates[tag] = new jSmart(tpl);
		}
		// interprétation du template
		var html = this._templates[tag].fetch(data);
		handler(html);
	};
	/**
	 * Génération d'un identifiant.
	 * @return	string	Identifiant.
	 */
	this.generateId = function() {
		var arr = new Uint8Array(20);
		window.crypto.getRandomValues(arr);
		var id = [].map.call(arr, function(byte) {
			return ("0" + byte.toString(16)).slice(-2);
		}).join("");
		return (id);
	};
	/**
	 * Création de plusieurs webcomponents.
	 * @param	array	list	Liste d'objects.
	 */
	this.createComponents = function(list) {
		for (var i = 0; i < list.length; i++) {
			this.createComponent(list[i]);
		}
	};
	/**
	 * Création d'un webcomponent.
	 * @param	string	tag		Nom du tag (sans le préfix "sk-").
	 * @param	Object	classObj	Objet qui va gérer le composant.
	 */
	this.createComponent = function(classObj) {
		// vérification du type du paramètre
		if ($.isArray(classObj)) {
			this.createComponents(classObj);
			return;
		}
		var tag = classObj.tag;
		var component = (function() {
			// création de l'objet gérant l'élément
			var proto = Object.create(HTMLElement.prototype);
			// définition d'attributs basiques dans cet objet
			proto.tag = tag;
			proto.manager = classObj;
			// ----- définition des méthodes de l'objet
			// -- méthode appelée à la création
			proto.createdCallback = function() {
				// vérification qu'il y a un identifiant
				var id = $(this).attr("id");
				if (id == undefined) {
					id = sk.generateId();
					$(this).attr("id", id);
				}
				// génération du HTML
				this.render();
			};
			// -- méthode appelée quand un attribut est modifié
			if (classObj.prototype && typeof classObj.prototype.changed == "function") {
				proto.attributeChangedCallback = classObj.prototype.changed;
			}
			// -- méthode d'affichage
			proto.render = function(data) {
				// si aucune donnée n'est fournie, on appelle la méthode de base de l'objet parent en lui passant en paramètre les attributs de l'élément HTML
				if (data == undefined) {
					// récupération des attributs de l'élément HTML
					var attrs = {};
					$.each(this.attributes, function(index, attr) {
						attrs[attr.name] = attr.value;
					});
					// appel de la méthode qui génère les données qui seront passées au template
					var node = this;
					classObj.prototype.created(attrs, function(response) {
						node.render(response);
					});
					return;
				}
				// on complète avec l'identifiant
				var id = $(this).attr("id");
				data.id = id;
				data.skThis = "$('#" + id + "')[0]";
				// interprétation du template et remplacement du contenu de l'élément par le code HTML généré
				var node = this;
				sk.render(this.tag, this.manager.template, data, function(html) {
					node.innerHTML = html;
				});
			};
			// -- ajout des autres méthodes de l'objet source
			for (var m in classObj.prototype) {
				if (typeof classObj.prototype[m] == "function") {
					proto[m] = classObj.prototype[m];
				}
			}
			// enregistrement de l'élément
			return (document.registerElement("sk-" + tag, {prototype: proto}));
		})();
	};
};
