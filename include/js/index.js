let m_status_time_chk = 0;
let m_time_last = 0;
let m_contents_url = "";
let m_root_url = "";
let m_notice_mode = "";

let m_header = null;
let m_contents_list = [];

let m_notice_timeout = null;

let m_curr_page = "";

var m_icon = null;
var m_icon_container = null;
var m_icon_dx = 5; // x축 방향 속도
var m_icon_dy = 2.5; // y축 방향 속도){
var m_pass_click_cnt = 0;
var m_pass_timeout;
let m_curr_pass_txt = "";
let m_checked_radio = "control1";
let m_pass_mode = "online";
let m_main_list = [];

function setInit() {

    $(".btn_pass").on("touchstart mousedown", function (e) {
        e.preventDefault();
        onClickBtnPass(this);
    });

    $(".key").on("touchstart mousedown", function (e) {
        e.preventDefault();
        onClickBtnKey(this);
    });

    $(".setting_btn").on("touchstart mousedown", function (e) {
        e.preventDefault();
        onClickBtnSetting(this);
    });

    $(".logout_btn").on("touchstart mousedown", function (e) {
        e.preventDefault();
        onClickBtnLogout(this);
    });

    $(".popup_ok_btn").on("touchstart mousedown", function (e) {
        e.preventDefault();
        onClickBtnPopupOk(this);
    });

    $(".popup_close_btn").on("touchstart mousedown", function (e) {
        e.preventDefault();
        onClickBtnPopupClose(this);
    });

    $(".volume").on("input", function (e) {
        e.preventDefault();
        onSliderChange(this);
    });

    $('.control_radio').on("touchstart mousedown", function () {
        onClickControlRadio(this);
    });

    $(".alert_ok_btn").on("touchstart mousedown", function (e) {
        e.preventDefault();
        onClickBtnAlertClose(this);
    });

    $(".alert_close_btn").on("touchstart mousedown", function (e) {
        e.preventDefault();
        onClickBtnAlertClose(this);
    });

    $(".menu_btn").on("touchstart mousedown", function (e) {
        e.preventDefault();
        onClickBtnMenu(this);
    });

    m_time_last = new Date().getTime();
    setInterval(setMainInterval, 1000);
    setLoadSetting("include/setting.json");
    setInitFsCommand();
    //setUpdateSlider();
}

function onClickBtnMenu(_obj){
    let t_code = $(_obj).attr("code");
    $(".menu_btn").removeClass("active");
    $(_obj).addClass("active");
}

function onClickBtnAlertClose(_obj) {
    $(".alert_page").hide();
}

function onClickBtnPopupOk(_obj) {
    //console.log(m_checked_radio);
    $(".popup_page").hide();
}

function onClickBtnPopupClose(_obj) {
    $(".popup_page").hide();
}

function onClickControlRadio(_obj) {
    var id = $(_obj).attr('id');
    m_checked_radio = id;
}

function onClickBtnLogout(_obj) {
    setMainReset();
}

function onClickBtnSetting(_obj) {
    setShowSetting();
}

function setShowSetting() {
    if ($('#control2').is(':checked')) {
        $('#control2').prop('checked', false);
        $('#control1').prop('checked', true);
    }
    m_checked_radio = "control1";
    $(".popup_page").show();
}


function setLoginResult(_str) {
    if (_str == "SUCC") {
        //setUpdateSlider();
        $(".menu_page").show();
    }else{
        setShowAlert("비밀번호가 일치하지 않습니다.");
        $(".pass_dot").removeClass("active");
        m_curr_pass_txt = "";
        setDotsCount();
    }
}

function onSliderChange(_obj) {
    var value = $(_obj).val();
    var min = $(_obj).attr('min');
    var max = $(_obj).attr('max');
    var percentage = Math.round(((value - min) / (max - min)) * 100);
    $(_obj).css('background', `linear-gradient(to right, #0EAAFB ${percentage}%, #FFFFFF33 ${percentage}%)`);
    var codeValue = $(_obj).closest('.menu_box').attr('code');
    var volumeText = $(_obj).closest('.menu_box').find('.menu_volume_txt');
    volumeText.text(value);
}

function setUpdateSlider() {
    let t_vol = $(".volume");
    t_vol.val(10);
    t_vol.trigger('input');
}

function onClickBtnKey(_obj) {
    if ($(_obj).hasClass("back_key")) {
        //console.log("back");
        if (m_curr_pass_txt.length > 0) {
            m_curr_pass_txt = m_curr_pass_txt.substr(0, m_curr_pass_txt.length - 1);
        }
    } else if ($(_obj).hasClass("login_key")) {
        //console.log("login");
        //setLoginResult("SUCC");
        setCheckLogin();
        return;
    } else if ($(_obj).hasClass("home_key")) {
        setMainReset();
        return;
    } else {
        //console.log($(_obj).html());
        if (m_curr_pass_txt.length < 6 && m_curr_pass_txt.length >= 0) {
            m_curr_pass_txt = m_curr_pass_txt + $(_obj).html();
        }
    };

    $(".pass_dot").each(function (index) {
        if (index < m_curr_pass_txt.length) {
            $(this).addClass("active");
        } else {
            $(this).removeClass("active");
        }
    });
    //console.log(m_curr_pass_txt);
}

function setCheckLogin() {
    if (m_curr_pass_txt.length != 6) {
        setShowAlert("비밀번호를 모두 입력해주세요.");
    } else {
        if(m_pass_mode=="online"){
            setCheckLoginSend(m_header.url_password);
        }else{
            console.log(m_curr_pass_txt);
            if(m_curr_pass_txt=="000000"){
                setLoginResult("SUCC");
            }else{
                setLoginResult("FAIL");
            }
        }
    }
}


function setCheckLoginSend(_url) {
    //console.log(_url);
    const timeout = 5000;
    const controller = new AbortController();
    const signal = controller.signal;

    // 타임아웃 설정 (timeout 밀리초 후 요청 취소)
    const timeoutId = setTimeout(() => {
        controller.abort(); // 요청 중단
    }, timeout);


    fetch(_url)
        .then(response => {
            clearTimeout(timeoutId); // 응답이 오면 타이머 해제
            return response.json();
        })
        .then(data => {
            let t_code = data.resultcode;
            if (t_code != undefined && t_code != null) {
                console.log(t_code);
                setLoginResult(t_code);
            }
        })
        .catch(error => {
            if (error.name === "AbortError") {
                console.error('요청이 타임아웃되었습니다.');
            } else {
                console.error('컨텐츠 에러 발생:', error);
            }
            setShowAlert("서버가 응답하지 않습니다.");
            m_pass_mode = "offline";
            setShowPassPage();
        });
}

function setShowAlert(_str) {
    $(".alert_title").html(_str);
    $(".alert_page").show();
}

function onClickBtnPass(_obj) {
    m_pass_click_cnt += 1;
    if (m_pass_click_cnt == 5) {
        setShowPassPage();
        m_pass_click_cnt = 0;
    } else {
        clearTimeout(m_pass_timeout);
        m_pass_timeout = setTimeout(resetPassCounter, 3000);
    }
}

function resetPassCounter() {
    m_pass_click_cnt = 0;
    clearTimeout(m_pass_timeout);
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
            m_main_list = data.main_list;
            setInitSetting();
        },
        error: function (xhr, status, error) {
            console.error('컨텐츠 에러 발생:', status, error);
            setInitSetting();
        },
    });
}

//로딩 커버 가리기
function setHideCover() {
    if ($(".cover").css("display") != "none") {
        $('.cover').hide();
    }
}

//초기화
function setInitSetting() {
    setHideCover();
    m_icon = $(".icon_obj");
    m_icon_container = $(".main_cont");
    if (m_header.logo_mode == "ani") {
        startAnimation();
    } else {
        var iconWidth = m_icon.width();
        var iconHeight = m_icon.height();
        m_icon.css({
            left: 2160 / 2 - iconWidth / 2,
            top: 3840 / 2 - iconHeight / 2
        });
    }
    
    for(var i=0;i<m_main_list.length;i+=1){
        let menuBox = $(".menu_box").eq(i);
        let data = m_main_list[i];
        let vol = Math.round(parseFloat(data.volume)*100);
        if(vol<0){
            vol = 0;
        }else if(vol>100){
            vol=100;
        }
        menuBox.find(".menu_name").text(data.name); // 메뉴 이름 변경
        menuBox.find(".volume").val(vol); // 슬라이더 값 변경
        menuBox.find(".menu_volume_txt").text(vol); // 볼륨 텍스트 변경
        menuBox.find(".volume").trigger("input");
    }
}

function setMainReset() {
    $(".menu_page").hide();
    $(".pass_page").hide();
    $(".main_page").show();
    m_pass_mode = "online";
}



function moveIcon() {
    var iconPos = m_icon.position();
    var containerWidth = m_icon_container.width();
    var containerHeight = m_icon_container.height();
    var iconWidth = m_icon.width();
    var iconHeight = m_icon.height();

    // 벽 충돌 감지
    if (iconPos.left + m_icon_dx < 0 || iconPos.left + iconWidth + m_icon_dx > containerWidth) {
        m_icon_dx = -m_icon_dx; // x축 방향 반전
    }
    if (iconPos.top + m_icon_dy < 0 || iconPos.top + iconHeight + m_icon_dy > containerHeight) {
        m_icon_dy = -m_icon_dy; // y축 방향 반전
    }

    // 아이콘 위치 업데이트
    m_icon.css({
        left: iconPos.left + m_icon_dx,
        top: iconPos.top + m_icon_dy
    });

    requestAnimationFrame(moveIcon);
}

function startAnimation() {
    moveIcon();
}

function setShowPassPage() {
    if(m_pass_mode=="online"){
        $(".pass_title").html("비밀번호를 입력해주세요");
    }else{
        $(".pass_title").html("오프라인 비밀번호를 입력해주세요");
    }
    $(".pass_page").show();
    $(".pass_dot").removeClass("active");
    m_curr_pass_txt = "";
    setDotsCount();

}

function setDotsCount() {
    let passLength = m_curr_pass_txt.length;

    $(".pass_dot").each(function (index) {
        if (index < passLength) {
            $(this).addClass("active");
        } else {
            $(this).removeClass("active");
        }
    });
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
    console.log("<<<", m_cate, m_sub);

    let t_top = 0;
    let t_left = 0;

    if (m_cate == "0") {
        if (m_sub == "1") {
            t_top = 120;
            t_left = 60;
        } else if (m_sub == "2") {
            t_top = 120;
            t_left = -60;
        }
    } else if (m_cate == "1") {
        if (m_sub == "1") {
            t_top = 150;
            t_left = -10;
        } else if (m_sub == "2") {
            t_top = 150;
            t_left = 90;
        }
    } else if (m_cate == "2") {
        if (m_sub == "1") {
            t_top = 150;
            t_left = -80;
        }
    } else if (m_cate == "3") {
        if (m_sub == "1") {
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
    console.log(">>>", m_cate, m_sub);

    let t_top = 0;
    let t_left = 0;

    if (m_cate == "0") {
        if (m_sub == "0") {
            t_top = -120;
            t_left = 0;
        } else if (m_sub == "1") {
            t_top = -120;
            t_left = -100;
        }
    } else if (m_cate == "1") {
        if (m_sub == "0") {
            t_top = -120;
            t_left = 30;
        } else if (m_sub == "1") {
            t_top = -120;
            t_left = -50;
        }
    } else if (m_cate == "2") {
        if (m_sub == "0") {
            t_top = -120;
            t_left = 80;
        }
    } else if (m_cate == "3") {
        if (m_sub == "0") {
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

    let {
        x: firstX,
        y: firstY
    } = getFirstPathCoordinates('path_0');

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
    if (_type == "prev") {
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
            y: parseFloat(coordinates[2]) // 첫 번째 Y 좌표
        };
    } else {
        console.error('첫 번째 좌표를 찾을 수 없습니다.');
        return {
            x: 0,
            y: 0
        }; // 좌표를 찾지 못한 경우 기본값 반환
    }
}
