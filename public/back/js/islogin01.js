$.ajax({
    type: "get",
    dataType: "json",
    url: "/employee/checkRootLogin",
    success:function (info) {
        if(info.error === 400){
            location.href = "login01.html";
        }
        if(info.success){
            console.log("登录成功");
        }
    }
})

