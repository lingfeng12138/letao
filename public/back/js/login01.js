$(function () {
    $('#form').bootstrapValidator({
        feedbackIcons: {
            valid: 'glyphicon glyphicon-heart',
            invalid: 'glyphicon glyphicon-flash',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            username: {
                validators: {
                    notEmpty: {
                        message: "用户名不能为空"
                    },
                    stringLength: {
                        min: 2,
                        max: 6,
                        message: "用户名长度必须在2-6之间"
                    },
                    callback: {
                        message: "用户名不存在"
                    }
                }
            },
            password:{
                validators:{
                    notEmpty:{
                        message:"密码不能为空"
                    },
                    stringLength:{
                        min:6,
                        max:12,
                        message:"密码长度必须在6-12之间"
                    },
                    callback:{
                        message:"密码错误"
                    }
                }
            }
        }
    })
    $("#form").on("success.form.bv",function(e){
        //阻止默认的提交
        e.preventDefault();
        //使用ajax
        $.ajax({
            type:"post",
            url:"/employee/employeeLogin",
            data:$("#form").serialize(),
            dataType:"json",
            success:function(info){
                if(info.error == 1000){
                    $('#form').data("bootstrapValidator").updateStatus("username","INVALID","callback");
                    return;
                }
                if(info.error == 1001){
                    $('#form').data("bootstrapValidator").updateStatus("password","INVALID","callback");
                    return;
                }
                if(info.success){
                    location.href = "index01.html";
                    return;
                }
            }
        })
    });
    $('[type="reset"]').click(function(){
        $('#form').data("bootstrapValidator").resetForm();
    })
})