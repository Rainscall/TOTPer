const decryptKey = atob("SnFhM0VnZHNzVmxnTUhZS3RuOGM=");

function startUp() {
    var localKey = localStorage.getItem("localKey");
    if (localKey) {
        var localKey = decryptAES256(localStorage.getItem("localKey"), decryptKey);
        keyInput.value = localKey;
        startTOTPgen();
    }
}

function encryptAES256(plaintext, key) {
    const ciphertext = CryptoJS.AES.encrypt(plaintext, key).toString();
    return ciphertext;
}
function decryptAES256(ciphertext, key) {
    const plaintext = CryptoJS.AES.decrypt(ciphertext, key).toString(CryptoJS.enc.Utf8);
    return plaintext;
}

var resetKeyCilckTimes = 0;
function resetKey() {
    const resetKeyText = document.getElementById('resetKeyText');
    if (resetKeyCilckTimes == 0) {
        resetKeyCilckTimes += 1;
        resetKeyText.innerText = 'confirm';
        return;
    }

    localStorage.clear();
    Toastify({
        text: "Key cleared.",
        duration: 1200,
        className: "info",
        position: "center",
        gravity: "bottom",
        style: {
            background: "#414141",
        }
    }).showToast();
    resetKeyCilckTimes = 0;
    resetKeyText.innerText = 'reset';
}

function startTOTPgen() {
    var $totp = document.getElementById('pwdOutput');
    const keyInput = document.getElementById('keyInput');
    const maxTime = 30;
    const progressArea = document.getElementById('progressArea');
    const progressLine = document.querySelectorAll(".progressLine");
    var localKey = localStorage.getItem("localKey");
    if (localKey) {
        localKey = decryptAES256(localStorage.getItem("localKey"), decryptKey);
    }

    if (!localKey) {
        localStorage.setItem("localKey", encryptAES256(keyInput.value, decryptKey));
        localKey = decryptAES256(localStorage.getItem("localKey"), decryptKey);
        Toastify({
            text: "Key saved.",
            duration: 1200,
            className: "info",
            position: "center",
            gravity: "bottom",
            style: {
                background: "#414141",
            }
        }).showToast();
    }

    if (localKey && keyInput.value && localKey != keyInput.value) {
        localStorage.clear();
        localStorage.setItem("localKey", encryptAES256(keyInput.value, decryptKey));
        localKey = decryptAES256(localStorage.getItem("localKey"), decryptKey);

        Toastify({
            text: "Key saved.",
            duration: 1200,
            className: "info",
            position: "center",
            gravity: "bottom",
            style: {
                background: "#414141",
            }
        }).showToast();
    }

    progressArea.style.display = "";
    rangeValue.value = maxTime;

    var key = keyInput.value;
    var totp = new TOTP(key);

    function refreshCode() {
        $totp.innerHTML = totp.genOTP();
    }

    function startInterval() {
        setInterval(function () {
            var ttl = Math.floor(Date.now() / 1000 % maxTime);
            rangeValue.innerText = maxTime - ttl;

            for (var i = 0; i < progressLine.length; i++) {
                progressLine[i].style.width = (maxTime - ttl) / maxTime * 100 + '%';
            }

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