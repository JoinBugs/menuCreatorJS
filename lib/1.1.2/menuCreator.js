( function( window, undefined )
{
	var menuCreator = {};
	window.menuCreator = menuCreator;

	(function()
	{
		var idMenu = 0,

		getListNodesAsType = function( typeNode, length )
		{
			var listNodes = [];
			for( var i = 0; i < length; i++ )
				listNodes.push( document.createElement( typeNode ) );
			return listNodes;
		},

			appendTitlesToList = function( listNodes, titlesNodes )
			{
				if( listNodes.length !== titlesNodes.length )
					throw new Error( 'Diferent length of ' + listNodes.length + ' and ' + titlesNodes.length );

				for( var i = listNodes.length; i; )
					listNodes[ --i ].textContent = titlesNodes[ i ];
				return listNodes;
			},

			appendListNodesToParent = function( parentNode, listNodes )
			{
				listNodes.forEach( function( node ) 
				{
					parentNode.appendChild( node );
				});
			},

			appendListNodesToListNodes = function( listNodesParent, listNodes )
			{
				for( var i = listNodes.length; i; )
					listNodesParent[ --i ].appendChild( listNodes[ i ] );
			},

			setAttrToListNodes = function( listNodes, props )
			{
				listNodes.forEach( function( node ) 
				{
					for( keyProp in props )
						node.setAttribute( keyProp, props[ keyProp ] );
				});
			};

			addIDAndClassToListNodes = function( listNodes, prefID, clase )
			{
				setAttrToListNodes( listNodes, { 'class' : clase } );
				var i = 0;
				listNodes.forEach( function( node )
				{
					node.setAttribute( 'id', prefID + '-' + i++ );
				});
			},

			applyEventToMenus = function( typeEvent, callBack, styles )
			{
				//console.dir( this );
				var cntx = {
					'styles' : styles
				};
				this.listMenus.forEach( function( node )
				{
					node.addEventListener( typeEvent, callBack.bind( cntx ), false );
				});
			},

			defaultEvents = ( function()
				{
					var subMenu = null,
						click = {

							alterLast : function( e )
							{
								if( subMenu !== null )
									configStyles.restetStyles( subMenu, this.styles );							

								subMenu = e.target.querySelector( '.subMenu' );
								configStyles.appendStyles( subMenu, this.styles );
							}
						};

					return {
						'click' : click
					};
				})(),

			defaultThemes = ( function()
				{
					var that = this,

						Themes = {
							'SKY' 	: 'theme-sky',
							'WALL'	: 'theme-wall'
						},

						Styles = {
							'ROW' 	: 'style-row',
							'COL' 	: 'style-col',
							'DOWN'	: 'style-down'
						},

						getIndexElement = function( obj, el )
						{
							var i = -1;
							for( var key in obj )
							{
								i++;
								if( obj[ key ] === el )
									return i;
							}
							return -1;
						},

						applyToListNodes = function( listNodes, func, params )
						{
							listNodes.forEach( function( node )
							{
								node.classList[ func ]( params );
							});
						},

						removeClass = function( configClass, itemClass )
						{
							if( getIndexElement( configClass.objClass, itemClass ) != -1 )
								applyToListNodes( configClass.listNodes, 'remove', itemClass + '-' + configClass.postfx );
							else
								throw new Error( "Dont exist this class in this stylesheet" );
						},

						applyClass = function( configClass )
						{
							window.este = this;
							if( getIndexElement( configClass.objClass, configClass.itemClass ) != -1 )
							{
								for( var key in configClass.objClass )
									removeClass( configClass, configClass.objClass[ key ] );

								applyToListNodes( configClass.listNodes, 'add', configClass.itemClass + '-' + configClass.postfx );
							}
							else
								throw new Error( "Dont exist this class in this stylesheet" );
						},

						applyTheme = function( theme )
						{
							var configClass = {
								'objClass' 		: Themes,
								'itemClass'  	: theme,
								'listNodes'		: this.listMenus,
								'postfx'		: 'menu'
							};

							applyClass( configClass );

							configClass[ 'listNodes' ] 	= this.subMenus.listSubMenus;
							configClass[ 'postfx' ]		= 'subMenu';

							applyClass( configClass );

							configClass[ 'listNodes' ] 	= [ this.rootMenu ];
							configClass[ 'postfx' ]		= 'rootMenu';

							applyClass( configClass );
						},

						applyStyle = function( style )
						{
							var configClass = {
								'objClass' 		: Styles,
								'itemClass'  	: style,
								'listNodes'		: this.listMenus,
								'postfx'		: 'menu'
							};

							applyClass( configClass );

							configClass[ 'listNodes' ] 	= this.subMenus.listSubMenus;
							configClass[ 'postfx' ]		= 'subMenu';

							applyClass( configClass );
						};

					return function()
					{
						 return {
							'Themes' 		: Themes,
							'Styles'		: Styles,
							'applyTheme' 	: applyTheme.bind( this ),
							'applyStyle'	: applyStyle.bind( this )
						};
					};

				})(),

			configStyles = ( function()
			{
				var appendStyles = function( node, styles )
				{
					for( var style in styles )
						node.style[ style ] = styles[ style ];
				},

				    appendStylesToNodes = function( listNodes, styles )
				    {
						listNodes.forEach( function( node )
						{
							appendStyles( node, styles );
						});
				    },

				 	restetStyles = function( node, styles )
				 	{
				 		var getLabelsStyles = function( styles )
				 		{
				 			var labels = [];
				 			for( var key in styles )
				 				labels.push( key );
				 			return labels;
				 		},

				 		listLabels = styles? getLabelsStyles( styles ) : getLabelsStyles( node.style );

				 		listLabels.forEach( function( style )
				 		{
				 			node.style[ style ] = '';
				 		});
				 	},

				 	getMaxAnchor = function( listNodes )
				 	{
					 	return Math.max.apply( null, listNodes.map( function( node )
						{
							return node.textContent.length;
						}));
				 	};

				return {
					'appendStyles' 			: appendStyles,
					'appendStylesToNodes' 	: appendStylesToNodes,
					'restetStyles' 			: restetStyles,
					'getMaxAnchor' 			: getMaxAnchor
				};
			})(),

			initStylesMenu = function( listNodes )
			{
				var styles = {
					'width' : configStyles.getMaxAnchor( listNodes ) + 'em',
					'height': '1.5em'
				};
				configStyles.appendStylesToNodes( listNodes, styles );
			},

			initStylesSubMenus = function( listNodes )
			{
				var styles = {
					'width' : configStyles.getMaxAnchor( listNodes ) + 'em'
				};
				//configStyles.appendStylesToNodes( listNodes, styles );
			};

		this.createMenu = function( titlesMenus, typeNodeMenu )
		{
			typeNodeMenu || ( typeNodeMenu = 'li' );
			var rootMenu = document.createElement( 'ul' );
			rootMenu.setAttribute( 'id', 'rootMenu-' + idMenu++ );
			rootMenu.setAttribute( 'class', 'barMenu' );

			var listMenus = appendTitlesToList( 
							getListNodesAsType( typeNodeMenu, titlesMenus.length ), 
																			titlesMenus );
			addIDAndClassToListNodes( listMenus, 'menu', 'menu' );
			appendListNodesToParent( rootMenu, listMenus );
			initStylesMenu( listMenus );

			var createSubMenus = function( listTitlesSubMenus, typeNodeSubMenu )
			{
				if( this.listMenus.length !== listTitlesSubMenus.length )
					throw new Error( 'Diferrent Length Of ' +
										this.listMenus.length + ' And ' + listTitlesSubMenus.length );

				typeNodeSubMenu || ( typeNodeSubMenu = 'p' );

				var listSubMenus = appendTitlesToList(
								getListNodesAsType( typeNodeSubMenu, listTitlesSubMenus.length ), 
																						listTitlesSubMenus );
				addIDAndClassToListNodes( listSubMenus, 'subMenu', 'subMenu' );
				appendListNodesToListNodes( this.listMenus, listSubMenus );
				initStylesSubMenus( listSubMenus );

				this[ 'subMenus' ] = {
						'listSubMenus' 		: listSubMenus,
						'titlesSubMenus'	: listTitlesSubMenus
				};
			};

			return {
				'rootMenu' 			: rootMenu,
				'listMenus' 		: listMenus,
				'titlesMenus' 		: titlesMenus,
				'applyEventToMenus' : applyEventToMenus,
				'defaultEvents' 	: defaultEvents,
				'defaultThemes'		: function()
				{
					return defaultThemes.call( this );
				},
				'createSubMenus'	: createSubMenus
			};
		}
	})
	.apply( menuCreator );
})
( window );