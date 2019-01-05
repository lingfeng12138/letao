//进度条
// NProgress.start();

// NProgress.done();

//ajax全局事件
//.ajaxComplete()  每个ajax完成时，都会调用 
//.ajaxSuccess()   每个ajax成功都会调用
//.ajaxError()     每个ajax失败都会调用
//.ajaxSend()      每个ajax准备发送调用

// .ajaxStart() 第一个ajax发送调用

// .ajaxStop() 所有的ajax都完成时

$(document).ajaxStart(function(){
    NProgress.start();
})
$(document).ajaxStop(function(){
    //模拟网络延迟
    setTimeout(function(){
        //进度条完成
        NProgress.done();
    },1000)
})


//公共功能
// 1.二级菜单
// 2.左侧边栏切换
// 3.退出功能

$(function(){
    $('.lt_aside .category').click(function(){
        $(this).next().stop().slideToggle()
    })

    $('.icon_left').click(function(){
        $('.lt_aside').toggleClass("hidemenu");
        $('.lt_main').toggleClass("hidemenu");
        $('.lt_topbar').toggleClass("hidemenu");
    })

    //退出
    $('.icon_logout').click(function(){
        $('#logoutModal').modal("show");
    });

    $('#logoutBtn').click(function(){
        $.ajax({
            type: "get",
            url: "/employee/employeeLogout",
            dataType:"json",
            success:function(info){
                if(info.success){
                    location.href = "login.html"
                }
            }
        })
    })
})