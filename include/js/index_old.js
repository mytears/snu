let m_status_time_chk = 0;
let m_time_last = 0;
let m_contents_url = "";
let m_root_url = "";
let m_notice_mode = "";
let m_header = null;
let m_contents_list = [[], [], [], []];

let m_curr_notice = 1;
let m_curr_notice_ptime = 0;
let m_curr_notice_type = "";
let m_curr_notice_cnt = -1;
let m_notice_timeout = null;
let m_admin_timeout;
let m_curr_video_zone = null;
let m_showInnerTimer;
let m_logo_url = "";
let m_curr_admin = 1;

let m_curr_page = "";
let m_clickable = true;
let m_curr_playing = null;
let m_sound_volume = 1.0;

let m_qr_code = null;

let m_cate = 0;
let m_sub = 0;

function setInit() {
    gsap.registerPlugin(MotionPathPlugin);
    /*
    $(".cup_img").on("touchstart mousedown", function (e) {
        e.preventDefault();
        onClickCup(this);        
    });
    */

    $(".page_00 .cup_zone").on("touchstart mousedown", function (e) {
        e.preventDefault();
        onClickCup(this);
    });

    $(".page_10 .main_menu").on("touchstart mousedown", function (e) {
        e.preventDefault();
        onClickMainMenu(this);
    });

    $(".prev_btn").on("touchstart mousedown", function (e) {
        e.preventDefault();
        onClickPrevBtn(this);
    });

    $(".next_btn").on("touchstart mousedown", function (e) {
        e.preventDefault();
        onClickNextBtn(this);
    });

    $(".home_btn").on("touchstart mousedown", function (e) {
        e.preventDefault();
        onClickHomeBtn(this);
    });

    $(".close_btn").on("touchstart mousedown", function (e) {
        e.preventDefault();
        onClickCloseBtn(this);
    });

    $(".pos_btn").on("touchstart mousedown", function (e) {
        e.preventDefault();
        onClickPopupBtn(this);
    });

    $("html").on("touchstart mousedown", function (e) {
        e.preventDefault();
        setTouched();
        setTouchSoundPlay();
    });

    m_time_last = new Date().getTime();
    setInterval(setMainInterval, 1000);
    setLoadSetting("include/setting.json");
    setInitFsCommand();
}

function setTouchSoundPlay() {
    setSoundPlay();
}

function setLoadSetting(_url) {
    $.ajax({
        url: _url,
        dataType: 'json',
        success: function (data) {
            m_contents_url = data.setting.content_url;
            m_root_url = data.setting.root_url;
            m_notice_mode = data.notice_mode;
            setContents();
        },
        error: function (xhr, status, error) {
            console.error('컨텐츠 에러 발생:', status, error);
        },
    });
}

//메인 타이머
function setMainInterval() {
    var time_gap = 0;
    var time_curr = new Date().getTime();

    time_gap = time_curr - m_time_last;
    time_gap = Math.floor(time_gap / 1000);
    if (time_gap > 180) {
        if ($(".page_00").css("display") == "none") {
            setMainReset();
        }
    }

    m_status_time_chk += 1;
    if (m_status_time_chk > 60) {
        m_status_time_chk = 0;
        setCallWebToApp('STATUS', 'STATUS');
    }
}

function setTouched() {
    m_time_last = new Date().getTime();
}


//kiosk_contents를 읽기
function setContents() {
    var t_url = m_contents_url;
    $.ajax({
        url: t_url,
        dataType: 'json',
        success: function (data) {
            m_header = data.header;
            m_contents_list = convCate(data.contents_list);
            //            setShowPopup(0, 0);
            //setTimeout(setHideCover, 500);
            setInitSetting();
        },
        error: function (xhr, status, error) {
            console.error('컨텐츠 에러 발생:', status, error);
            setInitSetting();
            //setTimeout(setHideCover, 500);
        },
    });
}

function convCate(_list) {
    let t_list = [[], [], [], []];

    for (var i = 0; i < _list.length; i += 1) {
        t_list[_list[i].cate].push(_list[i]);
    }
    //console.log(t_list);
    return t_list;
}

//로딩 커버 가리기
function setHideCover() {
    if ($(".cover").css("display") != "none") {
        $('.cover').hide();
    }
}

//초기화
function setInitSetting() {
    setBgmPlay();
    
    m_qr_code = new QRCode(document.getElementById("id_qr"), {
        text: '',
        width: 128,
        height: 128,
        colorDark: '#375D34',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.L,
    });
    setAlignWavePos();

    $("#id_over_0").hide();
    $("#id_over_1").hide();

    $(".popup_page").hide();
    $(".page_20").hide();
    $(".page_10").hide();
    $(".cate_00").hide();
    $(".cate_01").hide();
    $(".cate_02").hide();
    $(".cate_03").hide();

    m_curr_playing = new Audio(m_header.touch_sound);

    setTimeout(setHideCover, 500);
    //m_curr_page = ".page_00";
    setPage("00");
}

function setMainReset() {
    m_clickable = true;

    $(".cup_img").removeClass("pause");
    $(".cup_img").css("opacity", "1");
    $(".cup_wave").show();
    $(".page_00 .cup_txt").show();

    //$(".page_00 .cup_img").removeClass("pause");
    //$(".page_00 .cup_img").css("opacity", "1");
    //    $(".page_00 .cup_img").css("top", "740px");
    //    $(".page_00 .cup_img").css("left", "720px");
    //$(".page_00 .cup_wave").show();
    //$(".page_00 .cup_txt").show();


    //$(".page_10 .cup_img").removeClass("pause");
    //$(".page_10 .cup_img").css("opacity", "1");
    //    $(".page_10 .cup_img").css("top", "620px");
    //    $(".page_10 .cup_img").css("left", "700px");
    //$(".page_10 .cup_wave").show();

    setPage("00");
}

function setShowPopup(_cate, _num) {
    console.log("setShowPopup", _cate, _num);
    m_clickable = true;
    $(".txt_title").html("");
    $(".txt_desc").html("");
    $(".txt_address").html("");
    $(".txt_tel").html("");
    $(".txt_programs").html("");
    $(".img_0").attr("src", "");
    $(".img_1").attr("src", "");
    //$(".img_2").attr("src", "");
    $(".qr").hide();
    $(".popup_bot_txt_zone").hide();


    let t_contents = m_contents_list[_cate][_num];

    $(".txt_title").html(convStr(t_contents.name));
    $(".txt_desc").html(convStr(t_contents.desc));
    $(".txt_address").html(convStr(t_contents.address));
    $(".txt_tel").html(convStr(t_contents.tel));
    $(".txt_programs").html(convStr(t_contents.programs));
    $(".img_0").attr("src", t_contents.main_img_url);
    $(".img_1").attr("src", t_contents.sub_img_url);
    //$(".img_2").attr("src", t_contents.qr_img_url);
    m_qr_code.clear();
    if (t_contents.qr_img_url != "null" && t_contents.qr_img_url != null && t_contents.qr_img_url != undefined) {
        m_qr_code.makeCode(t_contents.qr_img_url);
        $(".qr").show();
        $(".popup_bot_txt_zone").show();
    }

    if ($(".txt_programs").html() == "") {
        $(".sub_area_2").hide();
    } else {
        $(".sub_area_2").show();
    }

    $(".popup_page").show();


    gsap.fromTo(".popup_area", {
        top: "151px",
        opacity: 0.25
    }, {
        top: "201px",
        duration: 0.5,
        opacity: 1,
        ease: "back.out"
    });

}

function setHidePopup() {
    m_clickable = true;
    $(".popup_page").fadeOut();
}

function convStr(_str) {
    if (_str == null) {
        return "";
    } else {
        return _str.replace(/(\r\n|\n\r|\n|\r)/g, '<br>');
    }
}

function onClickPrevBtn(_obj) {
    if (m_clickable == false) {
        return;
    }
    setClickableFalse();

    if ($(_obj).hasClass("disabled") == true) {
        m_clickable = true;
        return;
    }
    let t_sub = parseInt(m_sub) - 1;
    let t_max = Math.ceil(m_contents_list[parseInt(m_cate)].length / 4);
    setPrevNextBtnState(t_sub, t_max);
    if (t_sub <= -1) {
        m_clickable = true;
        return;
    }
    console.log(m_sub);
    let t_hide = ".cate_0" + m_cate + " .sub_0" + m_sub;
    console.log("<<<",m_cate,m_sub);
    
    let t_top = 0;
    let t_left = 0;
    
    if(m_cate == "0"){
        if(m_sub == "1"){
            t_top = 120;
            t_left = 60;
        }else if(m_sub == "2"){
            t_top = 120;
            t_left = -60;
        }
    }else if(m_cate == "1"){
        if(m_sub == "1"){
            t_top = 150;
            t_left = -10;
        }else if(m_sub == "2"){
            t_top = 150;
            t_left = 90;
        }
    }else if(m_cate == "2"){
        if(m_sub == "1"){
            t_top = 150;
            t_left = -80;
        }
    }else if(m_cate == "3"){
        if(m_sub == "1"){
            t_top = 150;
            t_left = 80;
        }
    }
    
    
    setMoveCup(t_hide, t_top, t_left, 2.5, "prev");
    //setMoveCup(t_hide, 120, 0, 1.5);

    setTimeout(setSubPage, 1500, t_sub.toString());
}

function onClickNextBtn(_obj) {

    if (m_clickable == false) {
        return;
    }
    setClickableFalse();

    if ($(_obj).hasClass("disabled") == true) {
        m_clickable = true;
        return;
    }
    let t_sub = parseInt(m_sub) + 1;
    let t_max = Math.ceil(m_contents_list[parseInt(m_cate)].length / 4);
    setPrevNextBtnState(t_sub, t_max);
    if (t_sub >= t_max) {
        m_clickable = true;
        return;
    }
    let t_hide = ".cate_0" + m_cate + " .sub_0" + m_sub;
    console.log(">>>",m_cate,m_sub);
    
    let t_top = 0;
    let t_left = 0;
    
    if(m_cate == "0"){
        if(m_sub == "0"){
            t_top = -120;
            t_left = 0;
        }else if(m_sub == "1"){
            t_top = -120;
            t_left = -100;
        }
    }else if(m_cate == "1"){
        if(m_sub == "0"){
            t_top = -120;
            t_left = 30;
        }else if(m_sub == "1"){
            t_top = -120;
            t_left = -50;
        }
    }else if(m_cate == "2"){
        if(m_sub == "0"){
            t_top = -120;
            t_left = 80;
        }
    }else if(m_cate == "3"){
        if(m_sub == "0"){
            t_top = -120;
            t_left = -90;
        }
    }
    
    setMoveCup(t_hide, t_top, t_left, 3, "next");

    setTimeout(setSubPage, 2000, t_sub.toString());
}

function setPrevNextBtnState(t_sub, t_max) {
    console.log(t_sub, t_max);
    if (t_sub == 0) {
        $(".prev_btn").addClass("disabled");
    } else {
        $(".prev_btn").removeClass("disabled");
    }

    if (t_sub == t_max - 1) {
        $(".next_btn").addClass("disabled");
    } else {
        $(".next_btn").removeClass("disabled");
    }
}

function setMoveCupHome(_parent, _top, _left, _duration) {
    let cupImg = $(_parent).find(".cup_img")[0];

    let { x: firstX, y: firstY } = getFirstPathCoordinates('path_0');
    
    let currentX = $(cupImg).offset().left;
    let currentY = $(cupImg).offset().top;
    
    let imgWidth = $(cupImg).outerWidth();
    let imgHeight = $(cupImg).outerHeight();
    
    let centerX = currentX + imgWidth / 2;
    let centerY = currentY + imgHeight / 2;
    
    let diffX = firstX - centerX;
    let diffY = firstY - centerY;
    //console.log(diffX, diffY);
    //return;

    gsap.set(cupImg, {
        animation: "none"
    });
    gsap.to(cupImg, {
        motionPath: {
            path: "#path_0",
            align: "#path_0",
            alignOrigin: [0.5, 0.5]
        },
        opacity: 0,
        scale: 0.5,
        duration: _duration,
        ease: "none",
        onComplete: function () {
            gsap.set(cupImg, {
                x: 0,
                y: 0,
                opacity: 1,
                scale: 1
            });
            $(cupImg).css('animation', 'up-down 0.75s infinite ease-out alternate');
        }
    });


    $(_parent + " .cup_wave").fadeOut();
}

function setMoveCup(_parent, _top, _left, _duration, _type) {
    let cupImg = $(_parent).find(".cup_img")[0];
    let f_top = parseFloat($(cupImg).css('top'));
    let f_left = parseFloat($(cupImg).css('left'));
    let scaleFactor = Math.max(0.5, 1 - (_duration / 2) * 0.1); 
    //console.log(scaleFactor);
    //scaleFactor = 1;
    if(_type == "prev"){
        scaleFactor = 1.15;
    }
    gsap.set(cupImg, {
        animation: "none"
    });
    gsap.to(cupImg, {
        x: _left,
        y: _top,
        opacity: 0,
        scale: scaleFactor,
        duration: _duration,
        //ease: "none",
        ease: "quad.out",
        onComplete: function () {
            gsap.set(cupImg, {
                x: 0,
                y: 0,
                opacity: 1,
                scale: 1
            });
            $(cupImg).css('animation', 'up-down 0.75s infinite ease-out alternate');
        }
    });
    $(_parent + " .cup_wave").fadeOut();
}

function onClickHomeBtn(_obj) {

    if (m_clickable == false) {
        return;
    }
    setClickableFalse();

    //setMainReset();
    setPage("10");
}

function onClickPopupBtn(_obj) {

    if (m_clickable == false) {
        return;
    }
    setClickableFalse();

    let t_code = $(_obj).attr("code");
    console.log("onClickPopupBtn", t_code);
    let t_cate = parseInt(t_code.substr(0, 1));
    let t_page = parseInt(t_code.substr(1, 1));
    let t_idx = parseInt(t_code.substr(2, 1));
    setShowPopup(t_cate, t_page * 4 + t_idx);
}

function onClickCloseBtn(_obj) {

    if (m_clickable == false) {
        return;
    }
    setClickableFalse();

    setHidePopup();
}

function onClickCup(_obj) {

    if (m_clickable == false) {
        return;
    }
    setClickableFalse();

    //$(_obj).addClass("pause").animate({ top: "-=100px", left:"+=100px", opacity: 0 }, 3000);
    /*
    $(".page_00 .cup_img").addClass("pause").animate({
        top: "-=60px",
        left: "+=130px",
        opacity: 0
    }, 1500);
    */
    setMoveCupHome(".page_00", -30, 65, 3);

    $(".page_00 .cup_wave").fadeOut();
    $(".page_00 .cup_txt").fadeOut();

    setTimeout(setPage, 2000, "10");
}

function onClickMainMenu(_obj) {
    console.log("m_clickable", m_clickable);
    if (m_clickable == false) {
        return;
    }
    setClickableFalse();

    let t_code = $(_obj).attr('code');
    //setPage("2"+t_code);
    /*
    $(".page_10 .cup_img").addClass("pause").animate({
        top: "-=60px",
        left: "-=40px",
        opacity: 0
    }, 1500);
    */
    setMoveCup(".page_10", -120, -80, 3);
    $(".page_10 .cup_wave").fadeOut();


    setTimeout(setPage, 2000, "2" + t_code);

}

function setPage(_code) {
    console.log('index setPage', _code);
    //$(".cup_img").show();
    //$(".cup_img").css("opacity","1");
    //$(".cup_wave").fadeIn();
    switch (_code) {
        case "00":
            setSwap(m_curr_page, ".page_00");
            break;
        case "10":
            $(".page_10 .cup_img").removeClass("pause");
            $(".page_10 .cup_img").css("opacity", "1");
            $(".page_10 .cup_wave").show();
            //$(".page_10 .cup_img").css("top", "620px");
            //$(".page_10 .cup_img").css("left", "700px");
            setSwap(m_curr_page, ".page_10");
            break;
        case "20":
            $("#id_title_0").html("전통 다도 여행");
            $("#id_title_1").html("하동의 전통적 다실 방문 코스");
            setSwap(m_curr_page, ".page_20");
            setCate(_code);
            break;
        case "21":
            $("#id_title_0").html("자연 다실 여행");
            $("#id_title_1").html("지리산 풍경과 섬진강이 어우러진<br>자연 풍경 속 다실 코스");
            setSwap(m_curr_page, ".page_20");
            setCate(_code);
            break;
        case "22":
            $("#id_title_0").html("현대 다실 여행");
            $("#id_title_1").html("젊은 감각의 현대적 다실 코스");
            setSwap(m_curr_page, ".page_20");
            setCate(_code);
            break;
        case "23":
            $("#id_title_0").html("휴식 다실 여행");
            $("#id_title_1").html("여유를 즐기며 다숙이 가능한 다실 코스");
            setSwap(m_curr_page, ".page_20");
            setCate(_code);
            break;
    }
}

function setCate(_code) {
    console.log("setCate", _code);
    let t_show = "";
    $("#id_over_0").hide();
    $("#id_over_1").hide();

    $(".cate_page").hide();
    $(".sub_page").hide();

    //$(".cup_img").show();
    //$(".cup_img").css("opacity","1");
    //$(".cup_wave").fadeIn();

    m_cate = _code.substr(1, 1);
    m_sub = "0";

    switch (_code) {
        case "20":
            $("#id_over_0").show();
            t_show = ".cate_00";
            break;
        case "21":
            $("#id_over_0").show();
            t_show = ".cate_01";
            break;
        case "22":
            $("#id_over_1").show();
            t_show = ".cate_02";
            break;
        case "23":
            $("#id_over_0").show();
            t_show = ".cate_03";
            break;
    }

    $(".prev_btn").addClass("disabled");
    if (m_contents_list[parseInt(m_cate)].length > 4) {
        $(".next_btn").removeClass("disabled");
    }


    $(t_show + " .cup_img").css("opacity", "1");
    $(t_show + " .cup_wave").show();
    $(t_show + " .sub_00").show();
    $(t_show).show();
    gsap.fromTo(t_show + " .page_bg", {
        top: "50px"
    }, {
        top: "0px",
        duration: 0.5,
        ease: "power2.out"
    });
}

function setSubPage(_num) {
    console.log("setSubPage", _num);
    let t_hide = ".cate_0" + m_cate + " .sub_0" + m_sub;
    let t_show = ".cate_0" + m_cate + " .sub_0" + _num;
    console.log(t_hide);
    console.log(t_show);
    $(t_show).css("z-index", "100");
    $(t_show).fadeIn(1000);
    //console.log(t_show + " .page_bg");
    if ($(t_show + " .page_bg").length > 0) {
        gsap.fromTo(t_show + " .page_bg", {
            top: "50px"
        }, {
            top: "0px",
            duration: 0.5,
            ease: "power2.out"
        });
    }
    $(t_hide).css("z-index", "90");
    setTimeout(setHide, 1000, t_hide);

    m_sub = _num;

}

function setSwap(_hide, _show) {
    m_curr_page = _show;
    $(_show).css("z-index", "100");
    $(_show).fadeIn(1000);
    if ($(_show + " .page_bg").length > 0) {
        gsap.fromTo(_show + " .page_bg", {
            top: "50px"
        }, {
            top: "0px",
            duration: 0.5,
            ease: "power2.out"
        });
    }
    //console.log(_hide);
    if (_hide != "") {
        $(_hide).css("z-index", "90");
        setTimeout(setHide, 1000, _hide);
    } else {
        m_clickable = true;
    }
}

function setHide(_hide) {
    m_clickable = true;
    $(_hide).hide();
    if ($(_hide + " .cup_img").length > 0) {
        $(_hide + " .cup_img").css("opacity", "1");
    }
}

function setBgmPlay() {
    const audio = new Audio(m_header.bgm_sound);
    audio.volume = m_header.bgm_volume;
    audio.loop = true; // 무한 반복 설정
    audio.play();
}

function setSoundPlay() {
    //console.log(_sound);
    /*
    if (m_curr_playing) {
        m_curr_playing.pause(); // 이전 오디오 중지
        m_curr_playing.currentTime = 0; // Reset time
    }
    */
    //m_curr_playing = new Audio(_sound);
    //m_curr_playing.volume = m_sound_volume;
    if (m_curr_playing) {
        m_curr_playing.pause(); // 이전 오디오 중지
        m_curr_playing.currentTime = 0; // Reset time
    }
    m_curr_playing.play();
    /*
    setTimeout(function () {
        m_curr_playing.play();
    }, 0);
    */
}

function setClickableFalse() {
    if (m_clickable == false) {
        return;
    }
    m_clickable = false;
    setTimeout(function () {
        //m_clickable = true;
    }, 1550);
}

function setAlignWavePos() {
    $(".cup_zone").each(function () {
        let $cupImg = $(this).find(".cup_img");
        let $cupWave = $(this).find(".cup_wave");

        let cupTop = $cupImg.position().top;
        let cupLeft = $cupImg.position().left;

        $cupWave.css({
            top: (cupTop + 155) + "px",
            left: (cupLeft + 17) + "px"
        });
    });

    $(".page_00 .cup_wave").css({
        "transform": "scale(1.11)", // 1.5배 확대
        "transform-origin": "top left" // 좌상단 기준으로 크기 조정
    });

    let $cupImg = $(".page_00 .cup_img");
    let $cupWave = $(".page_00 .cup_wave");

    let cupTop = $cupImg.position().top;
    let cupLeft = $cupImg.position().left;

    $cupWave.css({
        top: (cupTop + 165) + "px",
        left: (cupLeft + 10) + "px"
    });
}

function setQrCode(_id, _url) {
    var qrcode = new QRCode(document.getElementById(_id), {
        text: '',
        width: 128,
        height: 128,
        colorDark: '#375D34',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.L,
    });
    qrcode.clear();
    qrcode.makeCode(_url);
}


function setInitFsCommand() {
    if (window.chrome.webview) {
        window.chrome.webview.addEventListener('message', (arg) => {
            console.log(arg.data);
            setCommand(arg.data);
        });
    }
}
function getFirstPathCoordinates(pathId) {
    // SVG path 요소를 선택
    let path = document.getElementById(pathId);
    
    // path의 'd' 속성 값 가져오기
    let pathData = path.getAttribute('d');
    
    // 'M' 뒤에 있는 첫 번째 좌표 (X, Y) 값 추출
    let coordinates = pathData.match(/M\s*([\d\.]+)\s*([\d\.]+)/);
    
    if (coordinates) {
        return {
            x: parseFloat(coordinates[1]), // 첫 번째 X 좌표
            y: parseFloat(coordinates[2])  // 첫 번째 Y 좌표
        };
    } else {
        console.error('첫 번째 좌표를 찾을 수 없습니다.');
        return { x: 0, y: 0 };  // 좌표를 찾지 못한 경우 기본값 반환
    }
}