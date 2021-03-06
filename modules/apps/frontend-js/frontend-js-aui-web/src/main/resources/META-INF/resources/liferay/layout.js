AUI.add(
	'liferay-layout',
	function(A) {
		var Util = Liferay.Util;

		var BODY = A.getBody();

		var CSS_DRAGGABLE = 'portlet-draggable';

		var LAYOUT_CONFIG = Liferay.Data.layoutConfig;

		var Layout = {
			EMPTY_COLUMNS: {},

			INITIALIZED: false,

			OVER_NESTED_PORTLET: false,

			PORTLET_TOPPER: A.Node.create('<div class="portlet-topper"></div>'),

			PROXY_NODE: A.Node.create('<div class="lfr-portlet-proxy sortable-layout-proxy"></div>'),

			PROXY_NODE_ITEM: A.Node.create(
				'<div class="lfr-portlet-proxy sortable-layout-proxy">' +
					'<div class="portlet-topper">' +
						'<span class="portlet-title"></span>' +
					'</div>' +
				'</div>'
			),

			options: LAYOUT_CONFIG,

			bindDragDropListeners: function() {
				var layoutHandler = Layout.getLayoutHandler();

				layoutHandler.on('drag:end', A.bind('_onPortletDragEnd', Layout));
				layoutHandler.on('drag:start', A.bind('_onPortletDragStart', Layout));

				layoutHandler.delegate.dd.plug(
					{
						cfg: {
							horizontal: false,
							scrollDelay: 30,
							vertical: true
						},
						fn: A.Plugin.DDWinScroll
					}
				);
			},

			closeNestedPortlets: function(portlet) {
				var nestedPortlets = portlet.all('.portlet-boundary');

				nestedPortlets.each(
					function(portlet) {
						Liferay.Portlet.close(
							portlet,
							true,
							{
								nestedPortlet: true
							}
						);
					}
				);
			},

			findIndex: function(node) {
				var options = Layout.options;
				var parentNode = node.get('parentNode');

				return parentNode.all('> ' + options.portletBoundary).indexOf(node);
			},

			findReferencePortlet: function(dropColumn) {
				var portletBoundary = Layout.options.portletBoundary;
				var portlets = dropColumn.all('>' + portletBoundary);

				var firstPortlet = portlets.item(0);
				var referencePortlet = null;

				if (firstPortlet) {
					var firstPortletStatic = firstPortlet.isStatic;
					var lastStatic = null;

					if (!firstPortletStatic || (firstPortletStatic == 'end')) {
						referencePortlet = firstPortlet;
					}
					else {
						portlets.each(
							function(item) {
								var isStatic = item.isStatic;

								if (!isStatic ||
									(lastStatic && isStatic && (isStatic != lastStatic))) {
									referencePortlet = item;
								}

								lastStatic = isStatic;
							}
						);
					}
				}

				return referencePortlet;
			},

			fire: function() {
				var layoutHandler = Layout.getLayoutHandler();

				var retVal;

				if (layoutHandler) {
					retVal = layoutHandler.fire.apply(layoutHandler, arguments);
				}

				return retVal;
			},

			getActiveDropContainer: function() {
				var options = Layout.options;

				return A.all(options.dropContainer + ':not(.' + options.disabledDropContainerClass + ')').item(0);
			},

			getActiveDropNodes: function() {
				var options = Layout.options;

				var dropNodes = [];

				A.all(options.dropContainer).each(
					function(dropContainer) {
						if (!dropContainer.hasClass(options.disabledDropContainerClass)) {
							dropNodes.push(dropContainer.get('parentNode'));
						}
					}
				);

				return A.all(dropNodes);
			},

			getLayoutHandler: function() {
				if (!Layout.layoutHandler) {
					Liferay.fire('initLayout');
				}

				return Layout.layoutHandler;
			},

			getPortlets: function() {
				var options = Layout.options;

				return A.all(options.dragNodes);
			},

			hasMoved: function(dragNode) {
				var curPortletInfo = Layout.curPortletInfo;
				var moved = false;

				if (curPortletInfo) {
					var currentIndex = Layout.findIndex(dragNode);
					var currentParent = dragNode.get('parentNode');

					if ((curPortletInfo.originalParent != currentParent) ||
						(curPortletInfo.originalIndex != currentIndex)) {
						moved = true;
					}
				}

				return moved;
			},

			hasPortlets: function(columnNode) {
				var options = Layout.options;

				return !!columnNode.one(options.portletBoundary);
			},

			on: function() {
				var layoutHandler = Layout.getLayoutHandler();

				var retVal;

				if (layoutHandler) {
					retVal = layoutHandler.on.apply(layoutHandler, arguments);
				}

				return retVal;
			},

			refresh: function(portlet) {
				var layoutHandler = Layout.getLayoutHandler();

				portlet = A.one(portlet);

				if (portlet && layoutHandler) {
					layoutHandler.delegate.syncTargets();

					Layout.updatePortletDropZones(portlet);
				}
			},

			saveIndex: function(portletNode, columnNode) {
				var currentColumnId = Util.getColumnId(columnNode.get('id'));
				var portletId = Util.getPortletId(portletNode.get('id'));
				var position = Layout.findIndex(portletNode);

				if (Layout.hasMoved(portletNode)) {
					Liferay.fire(
						'portletMoved',
						{
							portlet: portletNode,
							portletId: portletId,
							position: position
						}
					);

					Layout.saveLayout(
						{
							cmd: 'move',
							p_p_col_id: currentColumnId,
							p_p_col_pos: position,
							p_p_id: portletId
						}
					);
				}
			},

			syncDraggableClassUI: function() {
				var options = Layout.options;

				if (options.dragNodes) {
					var dragNodes = A.all(options.dragNodes);

					if (options.invalid) {
						dragNodes = dragNodes.filter(':not(' + options.invalid + ')');
					}

					dragNodes.addClass(CSS_DRAGGABLE);
				}
			},

			syncEmptyColumnClassUI: function(columnNode) {
				var curPortletInfo = Layout.curPortletInfo;
				var options = Layout.options;

				if (curPortletInfo) {
					var columnHasPortlets = Layout.hasPortlets(columnNode);
					var emptyColumnClass = options.emptyColumnClass;
					var originalParent = curPortletInfo.originalParent;

					var originalColumnHasPortlets = Layout.hasPortlets(originalParent);

					var currentColumn = columnNode.ancestor(options.dropNodes);
					var originalColumn = originalParent.ancestor(options.dropNodes);

					if (currentColumn) {
						var dropZoneId = currentColumn.get('id');

						Layout.EMPTY_COLUMNS[dropZoneId] = !columnHasPortlets;
					}

					if (originalColumn) {
						var originalDropZoneId = originalColumn.get('id');

						Layout.EMPTY_COLUMNS[originalDropZoneId] = !originalColumnHasPortlets;
					}

					columnNode.toggleClass(emptyColumnClass, !columnHasPortlets);
					originalParent.toggleClass(emptyColumnClass, !originalColumnHasPortlets);
				}
			},

			updateCurrentPortletInfo: function(dragNode) {
				var options = Layout.options;

				Layout.curPortletInfo = {
					node: dragNode,
					originalIndex: Layout.findIndex(dragNode),
					originalParent: dragNode.get('parentNode'),
					siblingsPortlets: dragNode.siblings(options.portletBoundary)
				};
			},

			updateEmptyColumnsInfo: function() {
				var options = Layout.options;

				A.all(options.dropNodes).each(
					function(item) {
						var columnId = item.get('id');

						Layout.EMPTY_COLUMNS[columnId] = !Layout.hasPortlets(item);
					}
				);
			},

			updatePortletDropZones: function(portletBoundary) {
				var options = Layout.options;
				var portletDropNodes = portletBoundary.all(options.dropNodes);

				var layoutHandler = Layout.getLayoutHandler();

				portletDropNodes.each(
					function(item) {
						layoutHandler.addDropNode(item);
					}
				);
			},

			_afterPortletClose: function(event) {
				var column = event.column;

				if (column) {
					Layout.syncEmptyColumnClassUI(column);
				}
			},

			_getPortletTitle: A.cached(
				function(id) {
					var portletBoundary = A.one('#' + id);

					var portletTitle = portletBoundary.one('.portlet-title');

					if (!portletTitle) {
						portletTitle = Layout.PROXY_NODE_ITEM.one('.portlet-title');

						var title = portletBoundary.one('.portlet-title-default');

						var titleText = '';

						if (title) {
							titleText = title.html();
						}

						portletTitle.html(titleText);
					}

					return portletTitle.outerHTML();
				}
			),

			_onPortletClose: function(event) {
				var portlet = event.portlet;

				var column = portlet.ancestor(Layout.options.dropContainer);

				Layout.updateCurrentPortletInfo(portlet);

				if (portlet.test('.portlet-nested-portlets')) {
					Layout.closeNestedPortlets(portlet);
				}

				event.column = column;
			},

			_onPortletDragEnd: function(event) {
				var dragNode = event.target.get('node');

				var columnNode = dragNode.get('parentNode');

				Layout.saveIndex(dragNode, columnNode);

				Layout.syncEmptyColumnClassUI(columnNode);
			},

			_onPortletDragStart: function(event) {
				var dragNode = event.target.get('node');

				Layout.updateCurrentPortletInfo(dragNode);
			}
		};

		Layout.init = function(options) {
			options = options || Layout.options;

			options.handles = A.Array(options.handles);

			Layout.PROXY_NODE.append(Layout.PORTLET_TOPPER);

			var layoutContainer = options.container;

			Layout._layoutContainer = A.one(layoutContainer);

			Layout.DEFAULT_LAYOUT_OPTIONS = {
				columnContainer: layoutContainer,
				delegateConfig: {
					container: layoutContainer,
					dragConfig: {
						clickPixelThresh: 0,
						clickTimeThresh: 250
					},
					handles: options.handles,
					invalid: options.invalid
				},
				dragNodes: options.dragNodes,
				dropContainer: function(dropNode) {
					return dropNode.one(options.dropContainer);
				},
				dropNodes: Layout.getActiveDropNodes(),
				lazyStart: true,
				proxy: {
					resizeFrame: false
				}
			};

			var layoutModule = 'liferay-layout-column';

			if (themeDisplay.isFreeformLayout()) {
				layoutModule = 'liferay-layout-freeform';
			}

			var eventHandles = [];

			if (A.UA.ie || A.UA.edge) {
				eventHandles.push(
					BODY.delegate('mouseenter',
						function(event) {
							event.currentTarget.addClass('focus');
						},
						'.portlet'
					)
				);

				eventHandles.push(
					BODY.delegate('mouseleave',
						function(event) {
							event.currentTarget.removeClass('focus');
						},
						'.portlet'
					)
				);
			}

			A.use(
				layoutModule,
				function() {
					if (themeDisplay.isFreeformLayout()) {
						Layout.FreeFormLayout.register();
					}
					else {
						Layout.ColumnLayout.register();
					}

					Layout.bindDragDropListeners();

					Layout.updateEmptyColumnsInfo();

					Liferay.after('closePortlet', Layout._afterPortletClose);
					Liferay.on('closePortlet', Layout._onPortletClose);

					Liferay.on(
						'screenFlip',
						function() {
							if (eventHandles) {
								(new A.EventHandle(eventHandles)).detach();
							}

							Layout.getLayoutHandler().destroy();
						}
					);

					Layout.INITIALIZED = true;
				}
			);
		};

		Liferay.provide(
			Layout,
			'saveLayout',
			function(options) {
				var data = {
					doAsUserId: themeDisplay.getDoAsUserIdEncoded(),
					p_auth: Liferay.authToken,
					p_l_id: themeDisplay.getPlid()
				};

				A.mix(data, options);

				A.io.request(
					themeDisplay.getPathMain() + '/portal/update_layout',
					{
						after: {
							success: function() {
								Liferay.fire('updatedLayout');
							}
						},
						data: data
					}
				);
			},
			['aui-io-request']
		);

		Liferay.provide(
			Layout,
			'updateOverNestedPortletInfo',
			function() {
				var activeDrop = A.DD.DDM.activeDrop;
				var nestedPortletId = Layout.options.nestedPortletId;

				if (activeDrop) {
					var activeDropNode = activeDrop.get('node');
					var activeDropNodeId = activeDropNode.get('id');

					Layout.OVER_NESTED_PORTLET = (activeDropNodeId.indexOf(nestedPortletId) > -1);
				}
			},
			['dd-ddm']
		);

		if (LAYOUT_CONFIG) {
			var layoutContainer = A.one(LAYOUT_CONFIG.container);

			Liferay.once(
				'initLayout',
				function() {
					Layout.init();
				}
			);

			if (layoutContainer) {
				if (!A.UA.touch) {
					layoutContainer.once(
						'mousemove',
						function() {
							Liferay.fire('initLayout');
						}
					);
				}
				else {
					Liferay.fire('initLayout');
				}
			}
		}

		Liferay.Layout = Layout;
	},
	'',
	{
		requires: []
	}
);