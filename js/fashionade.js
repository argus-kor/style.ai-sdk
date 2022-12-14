var FASHIONADE = (function ($w) {
    var $ = function (query) {
        return document.querySelector(query)
    }
    var $$ = function (query) {
        return document.querySelectorAll(query)
    }
    var get = function (url, cb) {
        var xmlhttp
        xmlhttp = new XMLHttpRequest()
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                cb(JSON.parse(xmlhttp.responseText))
            }
        }
        xmlhttp.open('GET', url, true)
        xmlhttp.send()
    }
    var post = function (url, obj) {
        var xmlhttp
        xmlhttp = new XMLHttpRequest()
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                console.log('succeed', request.responseText)
            }
        }
        xmlhttp.open('POST', url, true)
        xmlhttp.setRequestHeader('Content-Type', 'application/json')
        xmlhttp.send(JSON.stringify(obj))
    }
    var strTitle = function (titles, type) {
        for (var innerHTML = '', i = 0, l = titles.length; i < l; ++i) {
            innerHTML +=
                '<li class="' +
                (i === 0 ? 'on' : '') +
                '" onClick="' +
                (function (i, type) {
                    return type === 'overlay'
                        ? 'FASHIONADE.RECOMMEND_LAYER_POSITION(' + (i + 1) + ");FASHIONADE.LOGS('click', 'STYLE" + (i + 1) + "');"
                        : 'FASHIONADE.RECOMMEND_POSITION(' + (i + 1) + ");FASHIONADE.LOGS('click', 'STYLE" + (i + 1) + "');"
                })(i, type) +
                '">' +
                titles[i].name +
                '</li>'
        }
        return '<ul class="fashionade--recommendTitleList">' + innerHTML + '</ul>'
    }
    var strContent = function (contents, type) {
        for (var innerHTML = '', i = 0, l = contents.length; i < l; ++i) {
            innerHTML += '<li>' + (type === 'overlay' ? strmainImage(contents[i].images) : '') + strItems(contents[i].items) + '</li>'
        }
        return '<ul class="fashionade--recommendContentList">' + innerHTML + '</ul>'
    }
    var strmainImage = function (images) {
        return (
            '<div class="fashionade--mainImageWrap"> \
                      <div class="fashionade--mainImage"><img src="' +
            images[0] +
            '" height="424" alt="" /></div> \
                      </div>'
        )
    }
    var isFashionadePage = location.host.indexOf('fashionade.ai') > -1
    var strItems = function (items) {
        for (var innerHTML = '', i = 0, l = Math.min(items.length, 3); i < l; ++i) {
            innerHTML +=
                '<li class="fashionade--item"> \
                        <div class="fashionade--thumb" style="background-image:url(\'' +
                items[i].imageUrl +
                '\')"><a href="' +
                (isFashionadePage ? 'https://www.fashionade.ai/item/' + items[i].productId : items[i].detailUrl) +
                '" target="FROM_FASHIONADE_SDK" onclick="FASHIONADE.LOGS(\'click\', \'THUMBNAIL' +
                (i + 1) +
                '\')">' +
                items[i].name +
                '</a></div> \
                        <div class="fashionade--content"> \
                          <dl> \
                            <dt class="fashionade--brand"><a href="' +
                (isFashionadePage ? 'https://www.fashionade.ai/item/' + items[i].productId : items[i].detailUrl) +
                '" target="FROM_FASHIONADE_SDK" onclick="FASHIONADE.LOGS(\'click\', \'BRAND' +
                (i + 1) +
                '\')">' +
                items[i].brand +
                '</a></dt> \
                            <dd class="fashionade--name"><a href="' +
                (isFashionadePage ? 'https://www.fashionade.ai/item/' + items[i].productId : items[i].detailUrl) +
                '" target="FROM_FASHIONADE_SDK" onclick="FASHIONADE.LOGS(\'click\', \'NAME' +
                (i + 1) +
                '\')">' +
                items[i].name +
                '</a></dd> \
                          </dl> \
                        </div> \
                  </li>'
        }
        return '<div class="fashionade--itemList"><ul>' + innerHTML + '</ul></div>'
    }

    var RECOMMEND = {
        INDEX: 1,
        LAYER_INDEX: 1,
        direct: function (dir) {
            RECOMMEND.show((RECOMMEND.INDEX += dir))
        },
        position: function (idx) {
            RECOMMEND.show((RECOMMEND.INDEX = idx))
        },
        show: function (idx) {
            var titles = $$('.fashionade--renderWrap .fashionade--recommendTitleList > li'),
                contents = $$('.fashionade--renderWrap .fashionade--recommendContentList > li')
            if (idx > contents.length) {
                RECOMMEND.INDEX = 1
            }
            if (idx < 1) {
                RECOMMEND.INDEX = contents.length
            }
            for (var i = 0, l = contents.length; i < l; ++i) {
                contents[i].style.display = 'none'
                titles[i].className = ''
            }
            contents[RECOMMEND.INDEX - 1].style.display = 'block'
            titles[RECOMMEND.INDEX - 1].className = 'on'
        },
        layer_direct: function (dir) {
            RECOMMEND.layer_show((RECOMMEND.LAYER_INDEX += dir))
        },
        layer_position: function (idx) {
            RECOMMEND.layer_show((RECOMMEND.LAYER_INDEX = idx))
        },
        layer_show: function (idx) {
            var titles = $$('.fashionade--layerWrap .fashionade--recommendTitleList > li'),
                contents = $$('.fashionade--layerWrap .fashionade--recommendContentList > li')
            if (idx > contents.length) {
                RECOMMEND.LAYER_INDEX = 1
            }
            if (idx < 1) {
                RECOMMEND.LAYER_INDEX = contents.length
            }
            for (var i = 0, l = contents.length; i < l; ++i) {
                contents[i].style.display = 'none'
                titles[i].className = ''
            }
            contents[RECOMMEND.LAYER_INDEX - 1].style.display = 'block'
            titles[RECOMMEND.LAYER_INDEX - 1].className = 'on'
        },
        layer_remove: function () {
            $('[data-fashionade-render-recommend-type="overlay"]').innerHTML = ''
        },
        showMainImage: function (el, imageUrl) {
            var lis = el.parentNode.getElementsByTagName('li')
            var img = new Image()
            for (var i = 0, l = lis.length; i < l; ++i) {
                lis[i].className = ''
            }
            el.className = 'on'
            img.onload = function () {
                el.parentNode.parentNode.childNodes[3].childNodes[0].src = imageUrl
            }
            img.src = imageUrl
        },
    }
    var getParam = function () {
        var params = {}
        window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (str, key, value) {
            params[key] = value
        })
        return params
    }
    var getMadUuid = function () {
        if (localStorage.getItem('madUuid')) {
            return localStorage.getItem('madUuid')
        } else {
            var _ = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (Math.random() * 16) | 0,
                    v = c == 'x' ? r : (r & 3) | 8
                return v.toString(16)
            })
            localStorage.setItem('madUuid', _)
            return _
        }
    }
    var config = {
        apiParams: {
            productId: getParam().productId || getParam().product_no || location.pathname.split('/')[3] || '',
            madUuid: getMadUuid(),
        },
    }
    var genLogData = function (type, eventPosition) {
        return {
            type: type,
            apiKey: config.apiParams.apiKey,
            uuid: getMadUuid(),
            userAgent: navigator.userAgent,
            lang: navigator.language,
            page: location.href,
            referrer: document.referrer,
            windowName: window.name,
            ext: config.logExt,
            deviceTime: new Date(),
            eventPosition: eventPosition !== undefined ? eventPosition : '',
        }
    }
    var postLogs = function (type, eventPosition) {
        post('https://admin.fashionade.ai/logs', genLogData(type, eventPosition))
    }
    var utils = {
        jsonToParams: function (data) {
            var params = '?'
            for (var prop in data) {
                params += encodeURIComponent(prop) + '=' + encodeURIComponent(data[prop]) + '&'
            }
            return params.substring(0, params.length - 1)
        },
    }
    var cache = {},
        tmpl = function (str, data) {
            var fn = !/\W/.test(str)
                ? (cache[str] = cache[str] || tmpl(document.getElementById(str).innerHTML))
                : new Function(
                    'obj',
                    'var p=[],print=function(){p.push.apply(p,arguments);};' +
                    "with(obj){p.push('" +
                    str
                        .replace(/[\r\t\n]/g, ' ')
                        .split('<%')
                        .join('\t')
                        .replace(/((^|%>)[^\t]*)'/g, '$1\r')
                        .replace(/\t=(.*?)%>/g, "',$1,'")
                        .split('\t')
                        .join("');")
                        .split('%>')
                        .join("p.push('")
                        .split('\r')
                        .join("\\'") +
                    "');}return p.join('');"
                )
            return data ? fn(data) : fn
        }

    var render = function (renderWrapperId, templateId) {
        get(config.apiUrl + utils.jsonToParams(config.apiParams), function (d) {
            FASHIONADE.LOGS('init')
            var showContents = d.length === 1 && d[0].items.length === 0 ? false : true

            if (d.length > 0 && showContents) {
                if (renderWrapperId && templateId) {
                    document.getElementById(renderWrapperId).innerHTML = tmpl(templateId, { data: d })
                    FASHIONADE.LOGS('render custom template')
                } else {
                    if ($('[data-fashionade-render-recommend-type="overlay"]') && $('[data-fashionade-open-layer="recommend"]')) {
                        $('[data-fashionade-open-layer="recommend"]').onclick = function (ev) {
                            ev.stopPropagation()
                            $('[data-fashionade-render-recommend-type="overlay"]').innerHTML =
                                '<div class="fashionade--layerWrap"><div class="fashionade--layerInnerWrap">' +
                                strTitle(d, 'overlay') +
                                strContent(d, 'overlay') +
                                (d.length > 1
                                    ? '<button class="fashionade--btn fashionade--prev" onClick="FASHIONADE.RECOMMEND_LAYER_DIRECT(-1);FASHIONADE.LOGS(\'click\', \'PREV\');">?????? ????????????</button> \
                        <button class="fashionade--btn fashionade--next" onClick="FASHIONADE.RECOMMEND_LAYER_DIRECT(1);FASHIONADE.LOGS(\'click\', \'NEXT\');">?????? ????????????</button>'
                                    : '') +
                                '<button class="fashionade--btn fashionade--close" onClick="FASHIONADE.RECOMMEND_LAYER_REMOVE()">??????</button></div></div> \
                                                <div class="fashionade--dimmed" onClick="FASHIONADE.RECOMMEND_LAYER_REMOVE()"></div>'

                            FASHIONADE.LOGS('open')
                        }
                    }

                    if ($('[data-fashionade-render-recommend-type="render"]')) {
                        $('[data-fashionade-render-recommend-type="render"]').innerHTML =
                            '<div class="fashionade--renderWrap">' +
                            strTitle(d) +
                            strContent(d) +
                            (d.length > 1
                                ? '<button class="fashionade--btn fashionade--prev" onClick="FASHIONADE.RECOMMEND_DIRECT(-1);FASHIONADE.LOGS(\'click\', \'PREV\');">?????? ????????????</button> \
                    <button class="fashionade--btn fashionade--next" onClick="FASHIONADE.RECOMMEND_DIRECT(1);FASHIONADE.LOGS(\'click\', \'NEXT\');">?????? ????????????</button>'
                                : '') +
                            '</div>'

                        FASHIONADE.LOGS('render default template')
                    }

                    if ($('.fashionade--btn-overlay')) {
                        $('.fashionade--btn-overlay').style.display = 'block'
                    }
                }
            }
        })

        tmpInit();
    }
    var attachLogEventToButtons = function () {
        if ($$('.btnBuyUl .btn-buy a').length > 0) {
            $$('.btnBuyUl .btn-buy a')[0].addEventListener('click', function () {
                FASHIONADE.LOGS('buy')
            })
        }
        if ($$('.btnBuyUl .btn-se a').length > 0) {
            $$('.btnBuyUl .btn-se a')[0].addEventListener('click', function () {
                FASHIONADE.LOGS('cart')
            })
            $$('.btnBuyUl .btn-se a')[1].addEventListener('click', function () {
                FASHIONADE.LOGS('wish')
            })
        }

        if ($$('#actionBuy').length > 0) {
            $$('#actionBuy')[0].addEventListener('click', function () {
                FASHIONADE.LOGS('buy')
            })
        }
        if ($$('#actionCart').length > 0) {
            $$('#actionCart')[0].addEventListener('click', function () {
                FASHIONADE.LOGS('cart')
            })
        }
        if ($$('#actionWish').length > 0) {
            $$('#actionWish')[0].addEventListener('click', function () {
                FASHIONADE.LOGS('wish')
            })
        }
    }
    document.addEventListener('DOMContentLoaded', function () {
        attachLogEventToButtons()
        //render();
    })

    var init = function (_config, _ext) {
        config.apiUrl = _config.apiUrl || (location.host.indexOf('thetose.com') > -1 ? 'https://www.fashionade.ai/api/v2/recommend-products' : 'https://styleapi.fashionade.ai/api/recommend')
        config.apiParams.apiKey = _config.apiKey //'fa_9sdf9d8f982394hds9fhs9h929a'
        config.apiParams.productId = _config.productId
        config.logExt = _ext
    }

    var tmpConfig = {
        APIs : {
            models : 'https://styleapi.fashionade.ai/api/vton/models',
            items : 'https://styleapi.fashionade.ai/api/vton/items?&page=0&size=100',
            composite : 'https://styleapi.fashionade.ai/api/vton'
        },
        apiKey : 'b1e98085133049cb95f4b3d397ce2ba822a4c7cce2944206add609ebd90fec71',
        // proxy : 'https://corsanywhere.herokuapp.com/',  //use temp proxy server
        proxy : '',
    }

    var html =  '    <div class="dimmed"></div>\n' +
        '    <div class="wrap">\n' +
        '        <div class="header">\n' +
        '            <h4>VIRTUAL FITTING</h4>\n' +
        '            <button class="btn-close" onClick="FASHIONADE.closeFashionadeVirtualFitting1()">??????</button>\n' +
        '            <button class="btn-edit" onClick="FASHIONADE.openEditMode()">??????</button>\n' +
        '        </div>\n' +
        '        <div class="horizon-wrap">\n' +
        '            <div class="models">\n' +
        '                <div class="models-content" id="modelContent">\n' +
        '                </div>\n' +
        '                <button class="btn-prev" onClick="FASHIONADE.prevModel()"><</button>\n' +
        '                <button class="btn-next" onClick="FASHIONADE.nextModel()">></button>\n' +
        '            </div>\n' +
        '            <div class="change-model">\n' +
        '                <div class="size">\n' +
        '                    Size <span id="virtual-model-size">-</span><span class="bar">|</span><span id="virtual-model-tall">-</span>cm, <span id="virtual-model-weight">-</span>kg\n' +
        '                </div>\n' +
        '                <button class="btn-change-model" onClick="FASHIONADE.chooseModel()">CHANGE MODEL</button>\n' +
        '                <button class="btn-choose-model" onClick="FASHIONADE.changeModel()">CHOOSE MODEL</button>\n' +
        '            </div>\n' +
        '            <div class="fitted-items">\n' +
        '                <ul>\n' +
        '                    <li class="default">\n' +
        '                        <img src="" width="75" height="75" alt="" />\n' +
        '                    </li>\n' +
        '                    <li id="addFittedItem" style="width:0">\n' +
        '                    </li>\n' +
        '                    <li class="btn-add" onClick="FASHIONADE.showCategories()">??????</li>\n' +
        '                </ul>\n' +
        '                <div class="notice">?????? ????????? ?????? ????????? ?????? ???????????????.</div>\n' +
        '            </div>\n' +
        '            <div class="prepared-items">\n' +
        '                <h4 id="prepared-category-title"></h4>\n' +
        '                   <button class="see-all" onClick="document.querySelector(\'#fashionade-virtual-fitting .prepared-items\').className = \'prepared-items see-all\'">See All</button>\n' +
        '                   <button class="back" onClick="document.querySelector(\'#fashionade-virtual-fitting .prepared-items\').className = \'prepared-items\'">Back</button>\n' +
        '                <ul></ul>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '    </div>\n' +
        '    <div class="wrap1">\n' +
        '        <div class="header">\n' +
        '            <h4>Your Measurements</h4>\n' +
        '            <button class="btn-close" onClick="FASHIONADE.closeFashionadeVirtualFitting()">??????</button>\n' +
        '        </div>\n' +
        '        <div class="wrapInputMeasurements">\n' +
        '           <div class="gender">\n' +
        '               <div class="female"></div>\n' +
        '               <div class="male"></div>\n' +
        '           </div>\n' +
        '           <div class="height">\n' +
        '               <h6>Height</h6>\n' +
        '               <p><input type="number" id="height" value="165"/><span>cm</span></p>\n' +
        '           </div>\n' +
        '           <div class="weight">\n' +
        '               <h6>Weight</h6>\n' +
        '               <p><input type="number" id="weight" value="51"/><span>kg</span></p>\n' +
        '           </div>\n' +
        '           <button class="btn-see-model" onClick="FASHIONADE.showStep2()">SEE MODELS</button>\n' +
        '        </div>\n' +
        '    </div>\n' +
        '    <div class="layer-category-list">\n' +
        '        <h4>Add Item</h4>\n' +
        '        <ul>\n' +
        // '            <li onClick="FASHIONADE.getTopCategory()">Top</li>\n' +
        '            <li onClick="FASHIONADE.getBottomCategory()">Bottom</li>\n' +
        '        </ul>\n' +
        '        <button class="btn-close" onClick="FASHIONADE.hideCategories()">??????</button>\n' +
        '    </div>';

    var productId = null;
    var fittedModels = [];
    var fittedItems = {
        TOPS : null,
        BOTTOMS : null
    };
    var chooseItems = {
        TOPS : [],
        BOTTOMS : []
    };
    var moving = true;
    var choosedFiitedModelIndex = 0;
    var carousel, carouselContent, slides, arrayOfSlides, arrayOfSlides, lengthOfSlide;

    var tmpInit = function (_config, _ext) {
        carousel = document.querySelector('#fashionade-virtual-fitting .models');
        carouselContent = document.querySelector('#fashionade-virtual-fitting .models-content');
        slides = document.querySelectorAll('#fashionade-virtual-fitting .slide');
        arrayOfSlides = Array.prototype.slice.call(slides);

        // reset markup
        if($("#fashionade-virtual-fitting") === null) {
            var el1 = document.createElement("div");
            el1.id = "fashionade-virtual-fitting";
            document.body.appendChild(el1);
            $("#fashionade-virtual-fitting").innerHTML = html;

            var el2 = document.createElement("button");
            el2.id = "btn-fashionade-virtual-fitting";
            el2.onclick = function() {
                $("#fashionade-virtual-fitting").style.visibility = "visible";
            };
            $(".item-detail-img-container").appendChild(el2);
        }

        productId = $$(".product-desc-value")[2].innerText;
        // productId = "1912232960"; //temp value

        setModels();
    }

    function setModels(byBtnStep2) {
        get(tmpConfig.proxy + tmpConfig.APIs.models + '?apiKey=' + tmpConfig.apiKey + '&productId=' + productId, function (d) {
            if(d.length > 0) {

                // loop models for checked gender.
                for(var i = 0, l = d.length; i < l; i++) {
                    if(d[i].gender === "FEMALE") {
                        document.querySelector(".gender .female").className = "female on";
                    } else if(d[i].gender === "MALE") {
                        document.querySelector(".gender .male").className = "male on";
                    }
                }

                fittedModels = d;
                matchingModel(byBtnStep2);
            }
        });
    }

    function matchingModel(byBtnStep2) {
        choosedFiitedModelIndex = 0;

        // asc sorted by tall & closet tall & change target's index is 0.
        var mTall = document.querySelector("#height").value;
        var mWeight = document.querySelector("#weight").value;
        fittedModels.sort((a, b) => {
            return a.tall - b.tall;
        });
        var tallMatchedIndex = fittedModels.indexOf(fittedModels.reduce(function(prev, curr) {
            return (Math.abs(curr.tall - mTall) < Math.abs(prev.tall - mTall) ? curr : prev);
        }));
        fittedModels.unshift(fittedModels.splice(tallMatchedIndex, 1)[0] );

        // reset models markup.
        $("#modelContent").innerHTML = "";
        fittedModels.map(function(model) {
            var el = document.createElement("div");
            el.className = "slide";
            el.style = "background-image:url(" + model.imageUrl + ")";
            $("#modelContent").appendChild(el);
        });
        $("#virtual-model-size").innerHTML = fittedModels[choosedFiitedModelIndex].size || "-";
        $("#virtual-model-tall").innerHTML = fittedModels[choosedFiitedModelIndex].tall || "-";
        $("#virtual-model-weight").innerHTML = fittedModels[choosedFiitedModelIndex].weight || "-";

        // set carousel
        carousel = document.querySelector('#fashionade-virtual-fitting .models');
        carouselContent = document.querySelector('#fashionade-virtual-fitting .models-content');
        slides = document.querySelectorAll('#fashionade-virtual-fitting .slide');
        arrayOfSlides = Array.prototype.slice.call(slides);
        getCarouselSize();
        moveSlidesRight();

        if(byBtnStep2) {
            // fitted default item
            $("#fashionade-virtual-fitting .fitted-items .default img").src = $(".item-detail-img-container img").src;

            //?????? ???????????? itemid??? ????????? ??? ?????? ?????? ?????? ???????????? ????????????id??? ???????????? ?????? ???. ?????? ?????? ????????? ?????? ??? ???.
            get(tmpConfig.proxy + tmpConfig.APIs.items + '&apiKey=' + tmpConfig.apiKey + '&productId=' + productId + '&category=TOP', function (d) {
                chooseItems.TOPS = [];
                d.map(function (item) {
                    chooseItems.TOPS.push(item);
                    if (productId === item.productId) {
                        fittedItems.TOPS = item.itemId;
                    }
                });

                fittedModels.map(function(m, i) {
                    get(tmpConfig.proxy + tmpConfig.APIs.composite + '?apiKey=' + tmpConfig.apiKey + '&modelId=' + m.id + '&topId=' + fittedItems.TOPS, function (d) {
                        m.defaultImageUrl = d.imageUrl;
                    });
                    $$('#fashionade-virtual-fitting .slide')[i + 1].style.backgroundImage = 'url("' + m.imageUrl + '")';
                    if(i === fittedModels.length - 1) {
                        $$('#fashionade-virtual-fitting .slide')[0].style.backgroundImage = 'url("' + m.imageUrl + '")';
                    }
                });

                if($("#fashionade-virtual-fitting .change-model").className.indexOf("choosemode") < 0) {
                    $("#fashionade-virtual-fitting .change-model").className = "change-model choosemode";
                    $("#fashionade-virtual-fitting .btn-prev").style.display = "block";
                    $("#fashionade-virtual-fitting .btn-next").style.display = "block";
                    $("#fashionade-virtual-fitting .fitted-items ul").style.display = "none";
                    $("#fashionade-virtual-fitting .fitted-items .notice").style.display = "block";
                    $("#fashionade-virtual-fitting .header .btn-edit").style.display = "block";
                }
                $("#fashionade-virtual-fitting .wrap1").style.display = "none";
            });

            //?????? BOTTOM ITEM ?????????
            get(tmpConfig.proxy + tmpConfig.APIs.items + '&apiKey=' + tmpConfig.apiKey + '&productId=' + productId + '&category=BOTTOM', function (d) {
                chooseItems.BOTTOMS = [];
                d.map(function(item) {
                    chooseItems.BOTTOMS.push(item);
                    // if(productId === item.productId) {
                    //     fittedItems.BOTTOMS = item.itemId;
                    // }
                });
                showItems("BOTTOM");
            });
        } else {
            //fitting

            //reset fitted.
            // removeFittedItem("BOTTOM");
            //
            // // get choose items(get all categories for matching productId) ????????? ?????? ?????? ?????? ??????.
            // get(tmpConfig.proxy + tmpConfig.APIs.items + '&apiKey=' + tmpConfig.apiKey + '&productId=' + productId + '&category=TOP', function (d) {
            //     chooseItems.TOPS = [];
            //     d.map(function(item) {
            //         chooseItems.TOPS.push(item);
            //         if(productId === item.productId) {
            //             fittedItems.TOPS = item.itemId;
            //         }
            //     });
            //
            //     // show choose items
            //     if(fittedItems.TOPS !== null) {
            //         // fitted default item
            //         $("#fashionade-virtual-fitting .fitted-items .default img").src = $(".item-detail-img-container img").src;
            //
            //         fittedModels.map(function(m, i) {
            //             get(tmpConfig.proxy + tmpConfig.APIs.composite + '?apiKey=' + tmpConfig.apiKey + '&modelId=' + m.id + '&topId=' + fittedItems.TOPS, function (d) {
            //                 m.defaultImageUrl = d.imageUrl;
            //                 // $$('#fashionade-virtual-fitting .slide')[i + 1].style.backgroundImage = 'url("' + d.imageUrl + '")';
            //                 // if(i === fittedModels.length - 1) {
            //                 //     $$('#fashionade-virtual-fitting .slide')[0].style.backgroundImage = 'url("' + d.imageUrl + '")';
            //                 // }
            //             });
            //         });
            //
            //         showItems("BOTTOM");
            //     } else {
            //         showItems("TOP");
            //     }
            //
            //     if(byBtnStep2 && $("#fashionade-virtual-fitting .change-model").className.indexOf("choosemode") < 0) {
            //         $("#fashionade-virtual-fitting .change-model").className = "change-model choosemode";
            //         $("#fashionade-virtual-fitting .btn-prev").style.display = "block";
            //         $("#fashionade-virtual-fitting .btn-next").style.display = "block";
            //         $("#fashionade-virtual-fitting .fitted-items ul").style.display = "none";
            //         $("#fashionade-virtual-fitting .fitted-items .notice").style.display = "block";
            //         $("#fashionade-virtual-fitting .header .btn-edit").style.display = "block";
            //         $("#fashionade-virtual-fitting .wrap1").style.display = "none";
            //     }
            // });
            // get(tmpConfig.proxy + tmpConfig.APIs.items + '&apiKey=' + tmpConfig.apiKey + '&productId=' + productId + '&category=BOTTOM', function (d) {
            //     chooseItems.BOTTOMS = [];
            //     d.map(function(item) {
            //         chooseItems.BOTTOMS.push(item);
            //         if(productId === item.productId) {
            //             fittedItems.BOTTOMS = item.itemId;
            //         }
            //     });
            //
            //     showItems("BOTTOM");
            //     if(byBtnStep2 && $("#fashionade-virtual-fitting .change-model").className.indexOf("choosemode") < 0) {
            //         $("#fashionade-virtual-fitting .change-model").className = "change-model choosemode";
            //         $("#fashionade-virtual-fitting .btn-prev").style.display = "block";
            //         $("#fashionade-virtual-fitting .btn-next").style.display = "block";
            //         $("#fashionade-virtual-fitting .fitted-items ul").style.display = "none";
            //         $("#fashionade-virtual-fitting .fitted-items .notice").style.display = "block";
            //         $("#fashionade-virtual-fitting .header .btn-edit").style.display = "block";
            //         $("#fashionade-virtual-fitting .wrap1").style.display = "none";
            //     }
            // });
        }

    }

    function addClone() {
        var lastSlide = carouselContent.lastElementChild.cloneNode(true);
        lastSlide.style.left = (-lengthOfSlide) + "px";
        carouselContent.insertBefore(lastSlide, carouselContent.firstChild);
    }

    function removeClone() {
        var firstSlide = carouselContent.firstElementChild;
        firstSlide.parentNode.removeChild(firstSlide);
    }

    function moveSlidesRight() {
        var slides = document.querySelectorAll('#fashionade-virtual-fitting .slide');
        var slidesArray = Array.prototype.slice.call(slides);
        var width = 0;

        slidesArray.forEach(function(el, i){
            el.style.left = width + "px";
            width += lengthOfSlide;
        });
        addClone();
    }

    function moveSlidesLeft() {
        var slides = document.querySelectorAll('#fashionade-virtual-fitting .slide');
        var slidesArray = Array.prototype.slice.call(slides);
        slidesArray = slidesArray.reverse();
        var maxWidth = (slidesArray.length - 1) * lengthOfSlide;

        slidesArray.forEach(function(el, i){
            maxWidth -= lengthOfSlide;
            el.style.left = maxWidth + "px";
        });
    }

    function getCarouselSize() {
        var slides = document.querySelectorAll('#fashionade-virtual-fitting .slide');
        var slidesArray = Array.prototype.slice.call(slides);
        lengthOfSlide = carousel.offsetWidth;
        var initialWidth = -lengthOfSlide;
        slidesArray.forEach(function(el) {
            el.style.width = lengthOfSlide + "px";
            el.style.left = initialWidth + "px";
            initialWidth += lengthOfSlide;
        });
    }

    function movePrev() {
        if ( moving ) {
            moving = false;
            var lastSlide = carouselContent.lastElementChild;
            lastSlide.parentNode.removeChild(lastSlide);
            carouselContent.insertBefore(lastSlide, carouselContent.firstChild);
            removeClone();
            var firstSlide = carouselContent.firstElementChild;
            firstSlide.addEventListener('transitionend', activateAgain);
            moveSlidesRight();

            if(choosedFiitedModelIndex > 0) {
                choosedFiitedModelIndex--;
            } else {
                choosedFiitedModelIndex = fittedModels.length - 1;
            }

            $("#virtual-model-size").innerHTML = fittedModels[choosedFiitedModelIndex].size || "-";
            $("#virtual-model-tall").innerHTML = fittedModels[choosedFiitedModelIndex].tall || "-";
            $("#virtual-model-weight").innerHTML = fittedModels[choosedFiitedModelIndex].weight || "-";
        }
    }

    function activateAgain() {
        var firstSlide = carouselContent.firstElementChild;
        moving = true;
        firstSlide.removeEventListener('transitionend', activateAgain);
    }

    function moveNext() {
        if ( moving ) {
            moving = false;
            removeClone();
            var firstSlide = carouselContent.firstElementChild;
            firstSlide.addEventListener('transitionend', replaceToEnd);
            moveSlidesLeft();

            if(choosedFiitedModelIndex < fittedModels.length - 1) {
                choosedFiitedModelIndex++;
            } else {
                choosedFiitedModelIndex = 0;
            }

            $("#virtual-model-size").innerHTML = fittedModels[choosedFiitedModelIndex].size || "-";
            $("#virtual-model-tall").innerHTML = fittedModels[choosedFiitedModelIndex].tall || "-";
            $("#virtual-model-weight").innerHTML = fittedModels[choosedFiitedModelIndex].weight || "-";
        }
    }

    function replaceToEnd() {
        var firstSlide = carouselContent.firstElementChild;
        firstSlide.parentNode.removeChild(firstSlide);
        carouselContent.appendChild(firstSlide);
        firstSlide.style.left = ( (arrayOfSlides.length -1) * lengthOfSlide) + "px";
        addClone();
        moving = true;
        firstSlide.removeEventListener('transitionend', replaceToEnd);
    }

    function showItems(category) {
        if(category === "TOP") {
            $("#prepared-category-title").innerHTML = "Tops";
            for(var _ = "", i = 0, l = chooseItems.TOPS.length; i < l; i++) {
                _ += '<li onClick="FASHIONADE.addItem(this ,\'TOP\', \'' + chooseItems.TOPS[i].itemId + '\', \'' + chooseItems.TOPS[i].imageUrl + '\')">\n' +
                    '            <div class="thumb" style="background-image:url(' + chooseItems.TOPS[i].imageUrl + ')"><span class="ico">Selected</span></div>\n' +
                    '            <p class="desc">' + chooseItems.TOPS[i].name + '</p>\n' +
                    '            </li>'
            }
            $(".prepared-items ul").innerHTML = _;
        } else {
            $("#prepared-category-title").innerHTML = "Bottoms";
            for(var _ = "", i = 0, l = chooseItems.BOTTOMS.length; i < l; i++) {
                _ += '<li onClick="FASHIONADE.addItem(this, \'BOTTOM\', \'' + chooseItems.BOTTOMS[i].itemId + '\', \'' + chooseItems.BOTTOMS[i].imageUrl + '\')">\n' +
                    '            <div class="thumb" style="background-image:url(' + chooseItems.BOTTOMS[i].imageUrl + ')"><span class="ico">Selected</span></div>\n' +
                    '            <p class="desc">' + chooseItems.BOTTOMS[i].name + '</p>\n' +
                    '            </li>'
            }
            $(".prepared-items ul").innerHTML = _;
        }
    }

    function addFittedItem(category, itemId, imageUrl) {
        if(itemId !== undefined) {
            if(category === "TOP") {
                fittedItems.TOPS = itemId;
            } else {
                fittedItems.BOTTOMS = itemId;
            }
        }
        if(imageUrl !== undefined) {
            $("#addFittedItem").innerHTML = '<img src="' + imageUrl + '" width="75" height="75" alt="" /><button class="btn-delete" onClick="FASHIONADE.removeItem(\'' + category + '\')">??????</button>';
            $("#addFittedItem").style.width = "75px";
        }

        //call composite image
        fittedModels.map(function(m, i) {
            get(tmpConfig.proxy + tmpConfig.APIs.composite + '?apiKey=' + tmpConfig.apiKey + '&modelId=' + m.id + '&topId=' + fittedItems.TOPS + (fittedItems.BOTTOMS ? '&bottomId=' + fittedItems.BOTTOMS : ''), function (d) {
                m.fittedImageUrl = d.imageUrl;

                //hard code
                //0 1 2 3
                //2 0 1 2
                //0 1 2 0
                //1 2 0 1
                if(choosedFiitedModelIndex === 0) {
                    $$('#fashionade-virtual-fitting .slide')[0].style.backgroundImage = 'url("' + fittedModels[2].fittedImageUrl + '")';
                    $$('#fashionade-virtual-fitting .slide')[1].style.backgroundImage = 'url("' + fittedModels[0].fittedImageUrl + '")';
                    $$('#fashionade-virtual-fitting .slide')[2].style.backgroundImage = 'url("' + fittedModels[1].fittedImageUrl + '")';
                    $$('#fashionade-virtual-fitting .slide')[3].style.backgroundImage = 'url("' + fittedModels[2].fittedImageUrl + '")';
                } else if(choosedFiitedModelIndex === 1) {
                    $$('#fashionade-virtual-fitting .slide')[0].style.backgroundImage = 'url("' + fittedModels[0].fittedImageUrl + '")';
                    $$('#fashionade-virtual-fitting .slide')[1].style.backgroundImage = 'url("' + fittedModels[1].fittedImageUrl + '")';
                    $$('#fashionade-virtual-fitting .slide')[2].style.backgroundImage = 'url("' + fittedModels[2].fittedImageUrl + '")';
                    $$('#fashionade-virtual-fitting .slide')[3].style.backgroundImage = 'url("' + fittedModels[0].fittedImageUrl + '")';
                } else if(choosedFiitedModelIndex === 2) {
                    $$('#fashionade-virtual-fitting .slide')[0].style.backgroundImage = 'url("' + fittedModels[1].fittedImageUrl + '")';
                    $$('#fashionade-virtual-fitting .slide')[1].style.backgroundImage = 'url("' + fittedModels[2].fittedImageUrl + '")';
                    $$('#fashionade-virtual-fitting .slide')[2].style.backgroundImage = 'url("' + fittedModels[0].fittedImageUrl + '")';
                    $$('#fashionade-virtual-fitting .slide')[3].style.backgroundImage = 'url("' + fittedModels[1].fittedImageUrl + '")';
                }
            });
        });
    }

    function removeFittedItem(category) {
        if(category === "TOP") {
            //???????????? ?????? ???????????? ????????? ??????.
            //fittedItems.TOPS = null;
        } else {
            fittedItems.BOTTOMS = null;
        }
        // reset default model
        //hard code
        if(category) {
            if(choosedFiitedModelIndex === 0) {
                $$('#fashionade-virtual-fitting .slide')[0].style.backgroundImage = 'url("' + fittedModels[2].defaultImageUrl + '")';
                $$('#fashionade-virtual-fitting .slide')[1].style.backgroundImage = 'url("' + fittedModels[0].defaultImageUrl + '")';
                $$('#fashionade-virtual-fitting .slide')[2].style.backgroundImage = 'url("' + fittedModels[1].defaultImageUrl + '")';
                $$('#fashionade-virtual-fitting .slide')[3].style.backgroundImage = 'url("' + fittedModels[2].defaultImageUrl + '")';
            } else if(choosedFiitedModelIndex === 1) {
                $$('#fashionade-virtual-fitting .slide')[0].style.backgroundImage = 'url("' + fittedModels[0].defaultImageUrl + '")';
                $$('#fashionade-virtual-fitting .slide')[1].style.backgroundImage = 'url("' + fittedModels[1].defaultImageUrl + '")';
                $$('#fashionade-virtual-fitting .slide')[2].style.backgroundImage = 'url("' + fittedModels[2].defaultImageUrl + '")';
                $$('#fashionade-virtual-fitting .slide')[3].style.backgroundImage = 'url("' + fittedModels[0].defaultImageUrl + '")';
            } else if(choosedFiitedModelIndex === 2) {
                $$('#fashionade-virtual-fitting .slide')[0].style.backgroundImage = 'url("' + fittedModels[1].defaultImageUrl + '")';
                $$('#fashionade-virtual-fitting .slide')[1].style.backgroundImage = 'url("' + fittedModels[2].defaultImageUrl + '")';
                $$('#fashionade-virtual-fitting .slide')[2].style.backgroundImage = 'url("' + fittedModels[0].defaultImageUrl + '")';
                $$('#fashionade-virtual-fitting .slide')[3].style.backgroundImage = 'url("' + fittedModels[1].defaultImageUrl + '")';
            }
        } else {
            if(choosedFiitedModelIndex === 0) {
                $$('#fashionade-virtual-fitting .slide')[0].style.backgroundImage = 'url("' + fittedModels[2].imageUrl + '")';
                $$('#fashionade-virtual-fitting .slide')[1].style.backgroundImage = 'url("' + fittedModels[0].imageUrl + '")';
                $$('#fashionade-virtual-fitting .slide')[2].style.backgroundImage = 'url("' + fittedModels[1].imageUrl + '")';
                $$('#fashionade-virtual-fitting .slide')[3].style.backgroundImage = 'url("' + fittedModels[2].imageUrl + '")';
            } else if(choosedFiitedModelIndex === 1) {
                $$('#fashionade-virtual-fitting .slide')[0].style.backgroundImage = 'url("' + fittedModels[0].imageUrl + '")';
                $$('#fashionade-virtual-fitting .slide')[1].style.backgroundImage = 'url("' + fittedModels[1].imageUrl + '")';
                $$('#fashionade-virtual-fitting .slide')[2].style.backgroundImage = 'url("' + fittedModels[2].imageUrl + '")';
                $$('#fashionade-virtual-fitting .slide')[3].style.backgroundImage = 'url("' + fittedModels[0].imageUrl + '")';
            } else if(choosedFiitedModelIndex === 2) {
                $$('#fashionade-virtual-fitting .slide')[0].style.backgroundImage = 'url("' + fittedModels[1].imageUrl + '")';
                $$('#fashionade-virtual-fitting .slide')[1].style.backgroundImage = 'url("' + fittedModels[2].imageUrl + '")';
                $$('#fashionade-virtual-fitting .slide')[2].style.backgroundImage = 'url("' + fittedModels[0].imageUrl + '")';
                $$('#fashionade-virtual-fitting .slide')[3].style.backgroundImage = 'url("' + fittedModels[1].imageUrl + '")';
            }
        }

        $("#addFittedItem").innerHTML = "";
        $("#addFittedItem").style.width = "0";
    }

    function setDefaultModels() {
        if(choosedFiitedModelIndex === 0) {
            $$('#fashionade-virtual-fitting .slide')[0].style.backgroundImage = 'url("' + fittedModels[2].imageUrl + '")';
            $$('#fashionade-virtual-fitting .slide')[1].style.backgroundImage = 'url("' + fittedModels[0].imageUrl + '")';
            $$('#fashionade-virtual-fitting .slide')[2].style.backgroundImage = 'url("' + fittedModels[1].imageUrl + '")';
            $$('#fashionade-virtual-fitting .slide')[3].style.backgroundImage = 'url("' + fittedModels[2].imageUrl + '")';
        } else if(choosedFiitedModelIndex === 1) {
            $$('#fashionade-virtual-fitting .slide')[0].style.backgroundImage = 'url("' + fittedModels[0].imageUrl + '")';
            $$('#fashionade-virtual-fitting .slide')[1].style.backgroundImage = 'url("' + fittedModels[1].imageUrl + '")';
            $$('#fashionade-virtual-fitting .slide')[2].style.backgroundImage = 'url("' + fittedModels[2].imageUrl + '")';
            $$('#fashionade-virtual-fitting .slide')[3].style.backgroundImage = 'url("' + fittedModels[0].imageUrl + '")';
        } else if(choosedFiitedModelIndex === 2) {
            $$('#fashionade-virtual-fitting .slide')[0].style.backgroundImage = 'url("' + fittedModels[1].imageUrl + '")';
            $$('#fashionade-virtual-fitting .slide')[1].style.backgroundImage = 'url("' + fittedModels[2].imageUrl + '")';
            $$('#fashionade-virtual-fitting .slide')[2].style.backgroundImage = 'url("' + fittedModels[0].imageUrl + '")';
            $$('#fashionade-virtual-fitting .slide')[3].style.backgroundImage = 'url("' + fittedModels[1].imageUrl + '")';
        }
    }

    function chooseModel() {
        setDefaultModels();
        document.querySelector("#fashionade-virtual-fitting .change-model").className = "change-model choosemode";
        document.querySelector("#fashionade-virtual-fitting .btn-prev").style.display = "block";
        document.querySelector("#fashionade-virtual-fitting .btn-next").style.display = "block";
        document.querySelector("#fashionade-virtual-fitting .fitted-items .notice").style.display = "block";
        document.querySelector("#fashionade-virtual-fitting .header .btn-edit").style.display = "block";
        document.querySelector("#fashionade-virtual-fitting .fitted-items ul").style.display = "none";
    }

    function changeModel() {
        addFittedItem("BOTTOM");
        document.querySelector("#fashionade-virtual-fitting .change-model").className = "change-model";
        document.querySelector("#fashionade-virtual-fitting .btn-prev").style.display = "none";
        document.querySelector("#fashionade-virtual-fitting .btn-next").style.display = "none";
        document.querySelector("#fashionade-virtual-fitting .fitted-items .notice").style.display = "none";
        document.querySelector("#fashionade-virtual-fitting .header .btn-edit").style.display = "none";
        document.querySelector("#fashionade-virtual-fitting .fitted-items ul").style.display = "block";
    }

    return {
        RECOMMEND_INDEX: function () {
            return RECOMMEND.INDEX
        },
        RECOMMEND_LAYER_INDEX: function () {
            RECOMMEND.LAYER_INDEX
        },
        RECOMMEND_DIRECT: RECOMMEND.direct,
        RECOMMEND_POSITION: RECOMMEND.position,
        RECOMMEND_LAYER_DIRECT: RECOMMEND.layer_direct,
        RECOMMEND_LAYER_POSITION: RECOMMEND.layer_position,
        RECOMMEND_LAYER_REMOVE: RECOMMEND.layer_remove,
        LOGS: function (type, eventPosition) {
            postLogs(type, eventPosition)
        },
        getParam: getParam,
        render: function (opts) {
            if (opts && opts.productId) {
                config.apiParams.productId = opts.productId
                if (opts && opts.templateWrapId && opts.templateId) {
                    render(opts.templateWrapId, opts.templateId)
                } else {
                    render()
                }
            }
        },
        init: init,
        tmpInit: tmpInit,
        closeFashionadeVirtualFitting : function() {
            document.querySelector("#fashionade-virtual-fitting").style.visibility = "hidden";
            document.querySelector("#fashionade-virtual-fitting .wrap1").style.display = "";
        },
        closeFashionadeVirtualFitting1 : function() {
            document.querySelector("#fashionade-virtual-fitting").style.visibility = "hidden";
            document.querySelector("#fashionade-virtual-fitting .wrap1").style.display = "";
        },
        openEditMode: function() {
            document.querySelector("#fashionade-virtual-fitting .wrap1").style.display = "block";
        },
        showStep2: function() {
            document.querySelector("#fashionade-virtual-fitting .prepared-items").className = "prepared-items";
            setModels(true);
        },
        prevModel : function() {
            movePrev();
        },
        nextModel : function() {
            moveNext();
        },
        changeModel : changeModel,
        chooseModel : chooseModel,
        showCategories : function() {
            document.querySelector("#fashionade-virtual-fitting .layer-category-list").style.display = "block";
            document.querySelector("#fashionade-virtual-fitting .dimmed").style.zIndex = 113;
        },
        hideCategories : function() {
            document.querySelector("#fashionade-virtual-fitting .layer-category-list").style.display = "none";
            document.querySelector("#fashionade-virtual-fitting .dimmed").style.zIndex = 111;
        },
        getTopCategory : function() {
            this.hideCategories();
            showItems("TOP");
        },
        getBottomCategory : function() {
            this.hideCategories();
            showItems("BOTTOM");
        },
        addItem : function(el, category, itemId, imageUrl) {
            if(document.querySelector("#fashionade-virtual-fitting .change-model").className.indexOf("choosemode") < 0) {
                document.querySelectorAll(".prepared-items ul li").forEach(el => {
                    el.className = "";
                });
                el.className = "selected";
                addFittedItem(category, itemId, imageUrl);
            }
        },
        removeItem : function(category) {
            document.querySelectorAll(".prepared-items ul li").forEach(el => {
                el.className = "";
            });
            removeFittedItem(category);
        }
    }
})(window);
