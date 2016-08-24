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
				 		styles || ( styles = ( function( node  )
				 			{
				 				var styles = [];
				 				for( var style in node.style )
				 					styles.push( style );
				 				return styles;
				 			})
				 			( node ));

				 		styles.forEach( function( style )
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
					'height': '1.5em'
				};
				configStyles.appendStylesToNodes( listNodes, styles );
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

			return {
				'rootMenu' 		: rootMenu,
				'listMenus' 	: listMenus,
				'titlesMenus' 	: titlesMenus, 
				createSubMenus	: function( listTitlesSubMenus, typeNodeSubMenu )
				{
					/*if( this.listMenus.length !=== listTitlesSubMenus.length )
						throw new Error( 'Diferrent Length Of ' +
											this.listMenus.length + ' And ' + listTitlesSubMenus.length );*/

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
				}
			};
		}
	})
	.apply( menuCreator );
})
( window );