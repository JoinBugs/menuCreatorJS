( function( window, undefined )
{
	window.addEventListener( 'load', initTest, false );
	window.menu = null;

	function initTest()
	{
		var title_menus = [
			'Start',
			'Movies',
			'Music',
			'Books',
			'Register'
		],
			title_subMenus = [
			'about us',
			'news',
			'populated',
			'search',
			'join now'
		];
		debugger;
		menu = menuCreator.createMenu( title_menus, 'div' );
		menu.createSubMenus( title_subMenus, 'div' );
		
		menu.defaultAspect().applyTheme( menu.defaultAspect().Themes.WALL );
		menu.defaultAspect().applyStyle( menu.defaultAspect().Styles.DOWN );
		
		menu.applyEventToMenus( 'click', menu.defaultEvents.click.alterLast, { width : '10em' } );
		document.querySelector( '#bar' ).appendChild( menu.rootMenu );
	}
}
)( window );

/*
	Aprobechjar a call y apply para 
	evitar cataratas de callbacks y 
	ahorrar el patron promise
*/