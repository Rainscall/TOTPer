function startTOTPgen() {
    var $totp = document.getElementById('pwdInput');
    var $ttl = document.getElementById('inputRange');
    const inputRangeCopy = document.getElementById('inputRangeCopy');
    var $rangeValue = document.getElementById('rangeValue');
    const keyInput = document.getElementById('keyInput');
    const maxTime = document.getElementById('maxTime').value;
    const progressArea = document.getElementById('progressArea');

    progressArea.style.display = "";


    rangeValue.value = maxTime;
    document.getElementById('inputRange').max = 100;
    inputRangeCopy.max = 100;

    var key = keyInput.value;
    var totp = new TOTP(key);

    function refreshCode() {
        $totp.innerHTML = totp.genOTP();
    }

    function startInterval() {
        setInterval(function () {
            var ttl = Math.floor(Date.now() / 1000 % maxTime);
            rangeValue.innerText = maxTime - ttl;
            $ttl.value = (maxTime - ttl) / maxTime * 100;
            inputRangeCopy.value = 100 - (maxTime - ttl) / maxTime * 100;
            if (ttl === 0) {
                refreshCode();
            }
        }, 1000);
    }

    function sync2NextSecond() {
        var ms2NextSecond = 1000 - (Date.now() % 1000);
        setTimeout(startInterval, ms2NextSecond);
    }

    sync2NextSecond();
    refreshCode();

};

function triggerButtonById(buttonId) {
    const button = document.getElementById(buttonId);

    if (button) {
        button.click();
    } else {
        console.log(`Button with id '${buttonId}' not found.`);
    }
}

function copyToClipboard(elementId) {
    var element = document.getElementById(elementId);
    element.select();
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
}

// 定义一个函数，接受一个参数id
function copyInnerText(id) {
    // 获取id对应的元素
    var element = document.getElementById(id);
    // 判断元素是否存在
    if (element) {
        var innerText = element.innerText;
        var textarea = document.createElement("textarea");
        textarea.value = innerText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        // 返回成功信息
        Toastify({
            text: "Copied.",
            duration: 1200,
            className: "info",
            position: "center",
            gravity: "bottom",
            style: {
                background: "#414141",
            }
        }).showToast();
        return 0;
    } else {
        // 返回失败信息
        return 1;
    }
}

function pressEnter(sourceTagId, varName) {
    sourceTag = document.getElementById(sourceTagId);
    if (sourceTag.value) {
        eval(varName + "();");
    }
}