$(document).ajaxStart(function(){
    NProgress.start();
})
$(document).ajaxStop(function(){
    setTimeout(function () { 
        NProgress.done();
     },1000)
})


//公共功能
// 二级菜单
// 左侧侧边栏切换
// 退出功能

$(function(){
    $('.lt_aside .category').click(function(){
        $(this).next().stop().slideToggle();
    })

    $(".icon_left").click(function(){
        $('.lt_aside').toggleClass("hidemenu");
        $('.lt_main').toggleClass("hidemenu");
        $('.lt_topbar').toggleClass("hidemenu");
    })

    $('icon_right').click(function () {
        $('#logoutModal').modal("show");
    })
    $("#logoutBtn").click(function () {
        $.ajax({
            type: 'get',
            url: '/employee/employeeLogout',
            dataType: "json",
            success:function (info) {
                if(info.success){
                    location.href = "login01.html";
                }
            }
        })
    })
})