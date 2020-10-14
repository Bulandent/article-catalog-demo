/*
 * base on jQuery - arAnchor v2.0
 * Copyright(c) 2016 by typeR
 * Date: 2017-5-27 16:10:41
 * Updated: 2020-10-05 23:38:10
 */
;
var arAnchor = (function() {
    if ( $('#postAr').length === 0 || $('.headerlink').length === 0 || $(window).width() < 900 ) {
        return function(){};
	}
	
    return function() {
        var $arContent = $('.post-content'),
        	$arContentAnchor = $arContent.find('.headerlink');
    
        // create an anchorbar
        var $arCatalog = $('<div class="arCatalog">' + 
                           '<div class="arCatalog-line"></div>' +
                           '<div class="arCatalog-list"><dl></dl></div>');
        
        var h2Seq = 1,
			h3Seq = 1;

        $arContentAnchor.each(function(i){
            var $this = $(this),
                acIndex = '',
                $dd = $('<dd><span class="arCatalog-index"></span><a></a><span class="arCatalog-dot"></span></dd>'),
				hTagName = $arContentAnchor[ i ].parentElement.tagName;
			
            if ( hTagName === 'H3' ) {
                acIndex = '' + --h2Seq + '.' + h3Seq++ + '';
                $dd.addClass( 'arCatalog-tack2' );
            } else {
                acIndex = h2Seq;
                h3Seq = 1;
                $dd.addClass( 'arCatalog-tack1' );
			}
			
            h2Seq++;
            $dd.find('.arCatalog-index').text( acIndex );
            $dd.find('a').attr('href','#');
            $dd.find('a').text( $this[0].title );
            $dd.appendTo( $arCatalog.find('dl')[ 0 ] );
		});
		
		var maxCatalogCount = parseInt((getViewPortHeight() - 180)/28); // 屏幕内能容纳的最大目录个数
		
		var marginTop = 0;  // 滚动距离
        var lineHeight = $arContentAnchor.length > maxCatalogCount ? (maxCatalogCount * 28 + 10) : ( $arContentAnchor.length * 28 + 10 );
        $arCatalog.find('.arCatalog-line').css('height', lineHeight );
        $arCatalog.find('.arCatalog-list').css({'maxHeight': lineHeight - 10, 'height': lineHeight - 10});
        $arCatalog.find('dd').eq(0).addClass('on');
        $arCatalog.appendTo($( '#arAnchorBar' )[ 0 ]);
        
        var catalogLength = $arContentAnchor.length,
			$firstCatalog = $arCatalog.find('dd'),
			$catalogList = $arCatalog.find('.arCatalog-list'),
			$catalogDl = $arCatalog.find('dl'),
			initListTop = $catalogDl[0].getBoundingClientRect().top,  // 初始列表的top值
			initListBottom = $catalogDl[0].getBoundingClientRect().bottom,
			bodyMidBottom = initListTop + (maxCatalogCount / 2 ) * 28,
			body = $catalogList[0].getBoundingClientRect();
		
		var lastSH = getScrollHeight(),  // 获取页面初始滚动距离
			defaultDirec = 'bottom';  // 默认滚动方向

        $(window).scroll(function(){
			debounce(setHighlight, 300)()
		});
		
		if (catalogLength > maxCatalogCount) {
			$(window).scroll(function(){
				debounce(scrollCatalog, 300)()
			})
		}

		// 防抖：触发高频事件 n 秒后只会执行一次，如果 n 秒内事件再次触发，则会重新计时。
		function debounce(fn, delay) {
			return function(args) {
				const _this = this
				clearTimeout(fn.id)
				fn.id = setTimeout(function() {
					fn.apply(_this, args)
				}, delay)
			}
		}

        // 自动滚动目录树，使得当前高亮目录在可视范围内
        function scrollCatalog() {
            var $currentCatalog = $arCatalog.find('dd.on');

			var curr = $currentCatalog[0].getBoundingClientRect(),
				list = $catalogDl[0].getBoundingClientRect();
			
			if (defaultDirec === 'bottom') {  // 向下滚动
				if (curr.bottom + maxCatalogCount * 14 <= body.bottom) {  // 上半部分
					
				} else if (curr.bottom - bodyMidBottom < list.bottom - body.bottom) {  
					marginTop += -Math.floor((curr.bottom - bodyMidBottom ) / 28) * 28
				} else if (body.bottom <= list.bottom) {  // 当剩余滚动距离
					marginTop = body.bottom - initListBottom
				}
			} else {  // 向上滚动
				if (body.top + maxCatalogCount * 14 <= curr.top) { 

				} else if (bodyMidBottom - curr.top < body.top - list.top) {
					marginTop += Math.floor((bodyMidBottom - curr.top) / 28) * 28
				} else if (list.top <= body.top) {
					marginTop = 0
				}
			}
			console.log('marginTop' + marginTop)
			$catalogDl.css('marginTop', marginTop)
        }

        // bind event for arCatalogtacks
        $arCatalog.find('a').each(function(i){
            var $this = $(this);
            $this.click(function(e){
                e.preventDefault();
                $('html,body').animate({ scrollTop: $arContentAnchor.eq(i).offset().top - 80}, 300, 'swing');
            });
        });

        // 高亮当前目录
        function setHighlight(){
			let {
				scrollTop,
			} = document.scrollingElement;
			
			var onIndex = $arCatalog.find('.on').index()
			$arCatalog.find('.on').removeClass('on')

			defaultDirec = getScrollDirection()
			if ($arContentAnchor.eq(catalogLength - 1)[0].getBoundingClientRect().top <= 82) {  // 尾部
                $firstCatalog.eq(catalogLength - 1).addClass('on')
			} else if (scrollTop === 0) {  // 顶部
				$firstCatalog.eq(0).addClass('on')
			} else {  // 中间：使用缓存，直接从上一次索引（onIndex）位置开始查找
				var index = onIndex
				if (defaultDirec === 'bottom') {
					while (index < catalogLength) {
						console.log('bottom index:' + index)
						let currTop = $arContentAnchor.eq(index)[0].getBoundingClientRect().top
						if ( currTop > 82 && index > 0){
							index--
							break
						}
						index++
					}
				} else {
					while (index >= 0) {
						console.log('top index:' + index)
						let currTop = $arContentAnchor.eq(index)[0].getBoundingClientRect().top
						if ( currTop <= 82){
							break
						}
						index--
					}
				}
				$firstCatalog.eq(index).addClass('on');
				// $arContentAnchor.each(function(i){
				// 	var $this = $(this);
				// 	console.log('$this.offset().top: ' + $this.offset().top + ', sh: ' + getScrollHeight())
				// 	if($this.offset().top - 82 <= getScrollHeight()){
				// 		$arCatalog.find('.on').removeClass('on');
				// 		$firstCatalog.eq(i).addClass('on');
				// 	}
				// });
			}
        }

        // 获取浏览器视口高度
        function getViewPortHeight(){
            if (document.all){
                return document.compatMode == "CSS1Compat" ? document.documentElement.clientHeight : document.body.clientHeight;
            } else {
                return self.innerHeight;
            }
        }

        // 获取页面滚动高度
        function getScrollHeight(){
            return document.body.scrollTop + document.documentElement.scrollTop
		}

		// 获取最近一次页面的滚动方向
		function getScrollDirection() {
			var sh = getScrollHeight(), ret = 'bottom'
			console.log('sh: lastSH ' + sh + ', ' + lastSH)
			if (sh < lastSH) {
				ret = 'top'
			}
			lastSH = sh
			console.log(`defaultDirec: ${ret}`)
			return ret
		}
    }
}());