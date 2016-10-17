<div style="border: 1px solid red;">
	{if $users}
		{foreach from=$users item=user}
			<sk-user-card name="{$user}"></sk-user-card>
		{/foreach}
	{else}
		VIDE
	{/if}
</div>
<button onclick="{$skThis}.setUserList('first')">Première liste</button>
<button onclick="alert({$skThis}.id)">Hello</button>
<button onclick="{$skThis}.setUserList('second')">Deuxième liste</button>
