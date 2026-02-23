let m_status_time_chk = 0;
let m_time_last = 0;
let m_contents_url = "";
let m_root_url = "";
let m_notice_mode = "";

let m_header = null;
let m_contents_list = [];

let m_notice_timeout = null;

let m_curr_page = "";

let m_icon = null;
let m_icon_container = null;
let m_icon_dx = 5; // x축 방향 속도
let m_icon_dy = 2.5; // y축 방향 속도
let m_pass_click_cnt = 0;
let m_pass_timeout;
let m_curr_pass_txt = "";
let m_checked_radio = "ON";
let m_pass_mode = "online";
let m_main_list = [];
let m_main_header = null;
let m_device_code = "";
let m_cate_code = "";
let m_contents_code = "";
let m_device_list = [];
let m_osc_number_list = [];
let m_cmd_list = [];
let m_is_first_page = true;
let m_big_button_num = -1;
let menuTextTimeout;

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

    $(".popup_pause_btn").on("touchstart mousedown", function (e) {
        e.preventDefault();
        onClickBtnPopupPause(this);
    });

    $(".popup_close_btn").on("touchstart mousedown", function (e) {
        e.preventDefault();
        onClickBtnPopupClose(this);
    });

    $(".volume").on("input", function (e) {
        e.preventDefault();
        onVolumeSlide(this);
    });


    /*
    $(".volume").on("input pointerdown pointermove", function (e) {
        console.log("Event triggered:", e.type, e.pointerType);
        e.preventDefault();
        onVolumeSlide(this);

        // 마우스 드래그 시 input 이벤트 강제 발생
        if (e.type === "pointermove" && e.pointerType === "mouse") {
            $(this).trigger("input");
        }
    });
*/





    $(".volume").on("change", function (e) {
        e.preventDefault();
        onVolumeChange(this);
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

    $(".menu_btn_b").on("touchstart mousedown", function (e) {
        e.preventDefault();
        onClickBtnMenuBig(this);
    });

    $(".menu_btn_s").on("touchstart mousedown", function (e) {
        e.preventDefault();
        onClickBtnMenuSmall(this);
    });

    $("html").on("touchstart mousedown", function (e) {
        e.preventDefault();
        setTouched();
    });
    
    
    const buttons = document.querySelectorAll('.menu_btn_s');

    buttons.forEach(btn => {
        btn.addEventListener('touchstart', function() {
            this.classList.add('is-active');
        }, {passive: true});

        btn.addEventListener('touchend', function() {
            this.classList.remove('is-active');
        }, {passive: true});
    });
    
    
    

    m_time_last = new Date().getTime();
    setInterval(setMainInterval, 1000);
    setLoadSetting("include/setting.json");
    setInitFsCommand();
}

function onClickBtnMenuBig(_obj) {
    if ($(_obj).hasClass("disabled") == true) {
        return;
    }
    
    clearTimeout(menuTextTimeout);
    $(".menu_mid_title").html("");
    $(".menu_mid_name").html("");
    
    let t_code = $(_obj).attr("code");
    console.log("onClickBtnMenuBig", m_device_code, t_code);
    // $(".menu_mid_title").html("");
    // $(".menu_mid_name").html("");
    m_cate_code = t_code;
    let t_num = parseInt(t_code) + 1;
    $(".menu_btn_b").removeClass("active");
    $(_obj).addClass("active");
    
    setMenuList(t_num);
}

function onClickBtnMenuSmall(_obj) {
    const t_code_str = $(_obj).attr("code");
    let t_code_num = parseInt(t_code_str, 10);
    const t_group = $(_obj).closest('.menu_bot_box').attr('code');
    $(".menu_btn_s").removeClass("active");
    //$(_obj).addClass("active");
    console.log("onClickBtnMenuSmall", m_device_code, t_code_num);
    $(".menu_mid_title").html("");
    $(".menu_mid_name").html("");
    let chk_num = 0;
    const osc = m_osc_number_list;
    if (t_code_num < 100) {
        switch (m_big_button_num) {
            case 0:
                chk_num = parseInt(osc.cmd_0, 10);
                break;
            case 1:
                chk_num = (t_group === "0") ? parseInt(osc.cmd_1, 10) :
                    (t_group === "1") ? parseInt(osc.cmd_2, 10) : 0;
                break;
            case 2:
                chk_num = parseInt(osc.cmd_3, 10);
                break;
            case 3:
                chk_num = parseInt(osc.cmd_4, 10);
                break;
        }
    } else { // t_code_num >= 100
        switch (m_big_button_num) {
            case 0:
                t_code_num -= 100;
                chk_num = parseInt(osc.cmd_5, 10);
                break;
            case 1:
                if (t_group === "1") {
                    const deviceCmdMap = {
                        0: 2801,
                        1: 3701,
                        2: 1901
                    };
                    chk_num = deviceCmdMap[m_device_code] || 0;
                }
                break;
        }
    }
    const t_cue = convCue(m_device_code, chk_num + t_code_num);
    const t_title = $(_obj).attr("title") || "";
    const t_desc = $(_obj).attr("desc") || "";
    $(".menu_mid_title").html(t_title);
    $(".menu_mid_name").html(t_desc);
    //$(".menu_mid_name").html(t_desc + " (" + t_cue + ")");
    clearTimeout(menuTextTimeout);
    menuTextTimeout = setTimeout(() => {
        $(".menu_mid_title").html("");
        $(".menu_mid_name").html("");
    }, 60000);
    setCmd(t_cue);
}

function onClickBtnMenu(_obj) {
    //let t_code = $(_obj).attr("code");
    let t_code = $(_obj).closest('.menu_box').attr('code');
    m_device_code = t_code;

    console.log("onClickBtnMenu", t_code);
    
    clearTimeout(menuTextTimeout);
    $(".menu_mid_title").html("");
    $(".menu_mid_name").html("");
    
    
    if ($(_obj).hasClass("active") == true) {
        $(".menu_btn").removeClass("active");
        $(".menu_page_txt").show();
        $(".menu_list_zone").hide();
        // $(".menu_mid_title").html("");
        // $(".menu_mid_name").html("");
    } else {
        $(".menu_btn").removeClass("active");
        $(_obj).addClass("active");
        $(".menu_page_txt").hide();
        $(".menu_list_zone").show();
        // $(".menu_mid_title").html("");
        // $(".menu_mid_name").html("");
        setMenuList(0);
        if (m_device_code == 3) {
            $(".menu_btn_b[code='1']").addClass("disabled");
            $(".menu_btn_b[code='3']").addClass("disabled");
        } else {
            $(".menu_btn_b[code='1']").removeClass("disabled");
            $(".menu_btn_b[code='3']").removeClass("disabled");
        }
    }
}

function setMenuList(_num) {
    let t_cmd = "";
    let t_cue = "";
    let chk_num = "";
    $(".menu_btn_s").removeClass("active");

    $(".menu_bot_box").hide();

    t_cmd = "";
    m_big_button_num = (_num - 1);
    switch (_num) {
        case 0:
            $(".menu_btn_b").removeClass("active");
            break;
        case 1:
            t_chk = parseInt(m_osc_number_list.cmd_start) + 1;
            t_cue = convCue(m_device_code, t_chk);
            setCmd(t_cue);
            $(".menu_bot_box[code='2']").show();

            /*
            if(m_device_code=="0" || m_device_code=="1"){
                $(".menu_btn_s[code='100']").html("Echoed Of Light Media");
            }else{
                $(".menu_btn_s[code='100']").html("");
            }
            */

            break;
        case 2:
            $(".menu_bot_box[code='0'] .box_title").show();
            $(".menu_bot_box[code='0']").show();
            $(".menu_bot_box[code='1']").show();
            break;
        case 3:
            $(".menu_bot_box[code='4'] .box_title").hide();
            $(".menu_bot_box[code='4']").show();

            break;
        case 4:
            setCallWebToApp('OSC_SEND', "/composition/groups/2/columns/1/connect");
            
            if (m_device_code == "0" || m_device_code == "2") {
                $(".menu_bot_box[code='3']").show();
            } else {
                chk_num = parseInt(m_osc_number_list.cmd_4);
                t_cue = convCue(m_device_code, chk_num);
                setCmd(t_cue);
            }
            break;
    }
}

function onClickBtnAlertClose(_obj) {
    $(".alert_page").hide();
}

function onClickBtnPopupOk(_obj) {
    console.log(m_checked_radio);
    sendPowerInfo(m_main_header.powerControlUrl, m_checked_radio);
    //$(".popup_page").hide();
}

function onClickBtnPopupPause(_obj) {
    setCmd("1");
}

function onClickBtnPopupClose(_obj) {
    $(".popup_page").hide();
}

function onClickControlRadio(_obj) {
    const id = $(_obj).attr('id');
    const code = $(_obj).attr('code');
    m_checked_radio = code;
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
    m_checked_radio = "ON";
    $(".popup_page").show();
}


function setLoginResult(_str) {
    if (_str == "SUCC") {
        $(".menu_page_txt").show();
        $(".menu_list_zone").hide();
        $(".menu_btn_b").removeClass("active");
        $(".menu_btn_s").removeClass("active");
        $(".menu_btn").removeClass("active");
        $(".menu_page").show();
    } else {
        setShowAlert("비밀번호가 일치하지 않습니다.");
        $(".pass_dot").removeClass("active");
        m_curr_pass_txt = "";
        setDotsCount();
    }
}

function setCmd(_str) {
    let t_cmd = "/cue/" + _str + "/start";
    setCallWebToApp('OSC_SEND', t_cmd);
}

function setCmdOLD(_type, _str) {
    let t_cmd = "";
    for (let i = 0; i < m_cmd_list.length; i += 1) {
        if (m_cmd_list[i].type == _type) {
            t_cmd = m_cmd_list[i].cmd_name + m_header.cmd_line + _str;
            break;
        }
    }
    setCallWebToApp('OSC_SEND', t_cmd);
}

function onVolumeChange(_obj) {
    const vol = $(_obj).val();
    const codeValue = $(_obj).closest('.menu_box').attr('code');
    //console.log(vol);
    let t_vol_db = volumeToDb(parseInt(vol));
    let t_cue = convCue(codeValue, t_vol_db);
    setCmd(t_cue);
    sendVolumeInfo(m_main_header.soundSaveUrl, codeValue, vol);
}

function onVolumeSlide(_obj) {
    const value = $(_obj).val();
    const min = $(_obj).attr('min');
    const max = $(_obj).attr('max');
    const percentage = Math.round(((value - min) / (max - min)) * 100);
    //console.log(value, min, max, percentage);
    $(_obj).css('background', `linear-gradient(to right, #0EAAFB ${percentage}%, #FFFFFF33 ${percentage}%)`);
    const codeValue = $(_obj).closest('.menu_box').attr('code');
    const volumeText = $(_obj).closest('.menu_box').find('.menu_volume_txt');
    volumeText.text(value);
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
        if (m_pass_mode == "online") {
            sendLoginInfo(m_header.password_url);
        } else {
            console.log(m_curr_pass_txt);
            if (m_curr_pass_txt == "000000") {
                setLoginResult("SUCC");
            } else {
                setLoginResult("FAIL");
            }
        }
    }
}



function sendPowerInfo(_url, _code) {
    const timeout = 60000;
    const controller = new AbortController();
    const signal = controller.signal;

    const params = new URLSearchParams();

    // 타임아웃 설정 (timeout 밀리초 후 요청 취소)
    const timeoutId = setTimeout(() => {
        controller.abort(); // 요청 중단
    }, timeout);

    let t_url = _url;

    if (_url.startsWith("http") == true) {
        params.append('power', _code);
    }
    $(".loading_cover").show();
    console.log(t_url);
    fetch(t_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params.toString(),
            signal: signal // signal 추가
        })
        .then(response => {
            clearTimeout(timeoutId); // 응답이 오면 타이머 해제
            return response.json();
        })
        .then(data => {
            $(".loading_cover").hide();
            $(".popup_page").hide();
            console.log(data);
            let t_code = data.resultcode;
            if (t_code != undefined && t_code != null) {
                if (t_code == "SUCC") {
                    setShowAlert("전원 신호 전달을 완료하였습니다.");
                    setDeviceAllPowerSetting(_code);
                } else {
                    setShowAlert("전원 신호 전달에 실패하였습니다.");
                }
            }
        })
        .catch(error => {
            $(".loading_cover").hide();
            $(".popup_page").hide();
            if (error.name === "AbortError") {
                console.error('요청이 타임아웃되었습니다.');
            } else {
                console.error('컨텐츠 에러 발생:', error);
            }
            setShowAlert("서버가 응답하지 않습니다.");
        });
}

function sendVolumeInfo(_url, _code, _vol) {
    const timeout = 5000;
    const controller = new AbortController();
    const signal = controller.signal;

    const params = new URLSearchParams();

    // 타임아웃 설정 (timeout 밀리초 후 요청 취소)
    const timeoutId = setTimeout(() => {
        controller.abort(); // 요청 중단
    }, timeout);

    let t_url = _url;

    if (_url.startsWith("http") == true) {
        //t_url = _url+"?pw="+m_curr_pass_txt;    
        params.append('code', m_main_list[parseInt(_code)].areaCode);
        params.append('volume', _vol);
    }

    $(".loading_cover").show();
    console.log(t_url);
    fetch(t_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params.toString(),
            signal: signal // signal 추가
        })
        .then(response => {
            clearTimeout(timeoutId); // 응답이 오면 타이머 해제
            return response.json();
        })
        .then(data => {
            $(".loading_cover").hide();
            //console.log(data);
            let t_code = data.resultcode;
            if (t_code != undefined && t_code != null) {
                if (t_code == "SUCC") {
                    //setShowAlert("볼륨 저장을 완료하였습니다.");
                } else {
                    setShowAlert("볼륨 저장에 실패하였습니다.");
                }
            }
        })
        .catch(error => {
            $(".loading_cover").hide();
            if (error.name === "AbortError") {
                console.error('요청이 타임아웃되었습니다.');
            } else {
                console.error('컨텐츠 에러 발생:', error);
            }
            setShowAlert("서버가 응답하지 않습니다.");
        });
}

function sendLoginInfo(_url) {
    const timeout = 5000;
    const controller = new AbortController();
    const signal = controller.signal;

    const params = new URLSearchParams();

    // 타임아웃 설정 (timeout 밀리초 후 요청 취소)
    const timeoutId = setTimeout(() => {
        controller.abort(); // 요청 중단
    }, timeout);

    let t_url = _url;

    if (_url.startsWith("http") == true) {
        //t_url = _url+"?pw="+m_curr_pass_txt;    
        params.append('pw', m_curr_pass_txt);
    }

    $(".loading_cover").show();
    //console.log(t_url);
    fetch(t_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params.toString(),
            signal: signal // signal 추가
        })
        .then(response => {
            clearTimeout(timeoutId); // 응답이 오면 타이머 해제
            return response.json();
        })
        .then(data => {
            $(".loading_cover").hide();
            console.log(data);
            let t_code = data.header.code;
            if (t_code != undefined && t_code != null) {
                //console.log(t_code);
                setLoginResult(t_code);
                m_main_header = data.header;
                m_main_list = data.list;
                setDeviceAllVolumeSetting();
            }
        })
        .catch(error => {
            $(".loading_cover").hide();
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
    /*
    var time_gap = 0;
    var time_curr = new Date().getTime();
    
    time_gap = time_curr - m_time_last;
    time_gap = Math.floor(time_gap / 1000);
    //console.log("time_gap", time_gap);
    if (time_gap >= 90) {
        m_time_last = new Date().getTime();
        if (m_is_first_page == false) {
            setMainReset();
        }
    }
    */

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
    const t_url = m_contents_url;
    $.ajax({
        url: t_url,
        dataType: 'json',
        success: function (data) {
            m_header = data.header;
            m_cmd_list = data.osc_cmd_list;
            m_device_list = data.device_list;
            m_osc_number_list = data.osc_number_list;
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
    m_icon = $(".icon_obj");
    m_icon_container = $(".main_cont");
    if (m_header.logo_mode == "ani") {
        startAnimation();
    } else {
        const iconWidth = m_icon.width();
        const iconHeight = m_icon.height();
        m_icon.css({
            left: 2160 / 2 - iconWidth / 2,
            top: 3840 / 2 - iconHeight / 2
        });
    }

    $(".alert_page").hide();
    $(".popup_page").hide();
    $(".pass_page").hide();
    $(".menu_page").hide();
    $(".main_page").show();
    m_pass_mode = "online";

    setTimeout(function () {
        setHideCover();
    }, 500);
}

function setMainReset() {
    console.log("setMainReset");
    $(".loading_cover").hide();
    $(".alert_page").hide();
    $(".popup_page").hide();
    $(".menu_page").hide();
    $(".pass_page").hide();
    $(".main_page").show();
    m_pass_mode = "online";
    m_is_first_page = true;
}

function setDeviceAllVolumeSetting() {
    for (let i = 0; i < m_main_list.length; i += 1) {
        let menuBox = $(".menu_box").eq(i);
        let data = m_main_list[i];
        let vol = parseInt(data.soundLevel);
        /*
        if (vol < 0) {
            vol = 0;
        } else if (vol > 100) {
            vol = 100;
        }
        */

        menuBox.find(".menu_name").text(data.areaName); // 메뉴 이름 변경
        menuBox.find(".volume").val(vol); // 슬라이더 값 변경
        menuBox.find(".menu_volume_txt").text(vol); // 볼륨 텍스트 변경
        menuBox.find(".volume").trigger("input");

        let t_vol_db = volumeToDb(parseInt(vol));
        let t_cue = convCue(i, t_vol_db);
        setCmd(t_cue);
    }
}

function setDevicelVolumeSetting(_name, _vol) {

    let data = null;
    let vol = 0;
    let t_num = -1;
    if (m_main_list.length == 0) {
        for (let i = 0; i < m_device_list.length; i += 1) {
            if (m_device_list[i].areaCode == _name) {
                data = m_device_list[i];
                t_num = i;
                break;
            }
        }
    } else {
        for (let i = 0; i < m_main_list.length; i += 1) {
            if (m_main_list[i].areaCode == _name) {
                data = m_main_list[i];
                t_num = i;
                break;
            }
        }
    }

    if (t_num == -1) {
        return;
    }

    //let menuBox = $(".menu_box").eq(t_num);
    // 2. DOM 요소 선택 (eq 대신 attribute selector 사용)
    // HTML의 <div class="menu_box" code="..."> 부분과 매칭
    let menuBox = $(".menu_box[code='" + t_num.toString() + "']");
    
    vol = parseInt(_vol);
    menuBox.find(".menu_name").text(data.areaName); // 메뉴 이름 변경
    menuBox.find(".volume").val(vol); // 슬라이더 값 변경
    menuBox.find(".menu_volume_txt").text(vol); // 볼륨 텍스트 변경
    menuBox.find(".volume").trigger("input");

    let t_vol_db = volumeToDb(parseInt(vol));
    let t_cue = convCue(t_num, t_vol_db);
    setCmd(t_cue);
}

function setDeviceAllPowerSetting(_cmd) {
    let t_cmd = "";
    let t_chk = "";
    if (_cmd == "OFF") {
        t_chk = parseInt(m_osc_number_list.cmd_stop);
    } else if (_cmd == "ON") {
        t_chk = parseInt(m_osc_number_list.cmd_start);
    }
    // /cue/{큐번호}/start
    if (_cmd == "") {
        return;
    }
    if (m_main_list.length == 0) {
        for (let i = 0; i < m_device_list.length; i += 1) {
            //t_cmd = "/cue/" + (i + 1) + "/" + t_chk;
            //setCmd(t_cue);
            let t_cue = convCue(i, t_chk);
            setCmd(t_cue);
        }
    } else {
        for (let i = 0; i < m_main_list.length; i += 1) {
            let t_cue = convCue(i, t_chk);
            setCmd(t_cue);
        }
    }
}

function setDevicelPowerSetting(_cmd, _name, _vol) {
    let data = null;
    let vol = 0;
    let t_num = -1;
    let t_cmd = "";
    if (m_main_list.length == 0) {
        for (let i = 0; i < m_device_list.length; i += 1) {
            if (m_device_list[i].areaCode == _name) {
                data = m_device_list[i];
                t_num = i;
                break;
            }
        }
    } else {
        for (let i = 0; i < m_main_list.length; i += 1) {
            if (m_main_list[i].areaCode == _name) {
                data = m_main_list[i];
                t_num = i;
                break;
            }
        }
    }

    if (t_num == -1) {
        return;
    }


    if (_cmd == "OFF") {
        t_chk = parseInt(m_osc_number_list.cmd_stop);
    } else if (_cmd == "ON") {
        t_chk = parseInt(m_osc_number_list.cmd_start);
        setDevicelVolumeSetting(_name, _vol);
    }
    let t_cue = convCue(t_num, t_chk);
    setCmd(t_cue);
}

function moveIcon() {
    const iconPos = m_icon.position();
    const containerWidth = m_icon_container.width();
    const containerHeight = m_icon_container.height();
    const iconWidth = m_icon.width();
    const iconHeight = m_icon.height();

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
    if (m_pass_mode == "online") {
        $(".pass_title").html("비밀번호를 입력해주세요");
    } else {
        $(".pass_title").html("오프라인 비밀번호를 입력해주세요");
    }
    $(".pass_page").show();
    $(".pass_dot").removeClass("active");
    m_curr_pass_txt = "";
    m_is_first_page = false;
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


function volumeToDb(volume) {
    let t_vol_list = [69, 68, 67, 66, 65, 64, 63, 62, 61, 60, 60];
    let t_i = volume;
    return t_vol_list[t_i];
    /*
    // 0~100 값을 0.0~1.0 범위로 변환
    let normalizedVolume = volume / 100.0;

    if (normalizedVolume <= 0) return -60.0; // 너무 낮으면 -60dB로 처리

    return 20 * Math.log10(normalizedVolume);
    */
}

function convCue(_num, _cue) {
    let f_cue = parseInt(m_device_list[parseInt(_num)].oscCode);
    let r_cue = 0;
    if (_cue == 100) {
        r_cue = f_cue / 100;
    } else {
        r_cue = f_cue + parseInt(_cue);
    }
    return r_cue;
}



function setInitFsCommand() {
    if (window.chrome.webview) {
        window.chrome.webview.addEventListener('message', (arg) => {
            console.log(arg.data);
            setCommand(arg.data);
        });
    }
}

function setCommand(_data) {
    console.log("setCommand", _data);
    const parts = _data.trim().split('|');
    // 첫 번째 값이 "S"이고 마지막 값이 "E"인지 확인
    if (parts[1] !== "S" || parts[parts.length - 1] !== "E") {
        console.log(`[Invalid] ${_data} - Incorrect start or end.`);
        return null;
    }
    if (parts[2] == "SOUND") {
        setDevicelVolumeSetting(parts[2], parts[3]);
    } else if (parts[2] == "ON" || parts[1] == "OFF") {
        setDevicelPowerSetting(parts[1], parts[2], parts[3]);
    } else if (parts[2] == "DOWN") {
        if (parts[3] == "START") {
            $(".loading_cover").show();
        } else if (parts[3] == "OK") {
            $(".loading_cover").hide();
        }
    }
}
