<div class="userlist">
	{if $users}
		{foreach from=$users item=user}
			<sk-user-card name="{$user.name|escape}" age="{$user.age|escape}"></sk-user-card>
		{/foreach}
	{else}
		VIDE
	{/if}
</div>
<button onclick="{$skThis}.setUserList('real')" {if $userlist != 'fake'}disabled{/if}>Real users list</button>
<button onclick="{$skThis}.setUserList('fake')" {if $userlist == 'fake'}disabled{/if}>Fake users list</button>
