$(function(){
    var currentId;
    var idDelete;

    var currentPage = 1;
    var pageSize = 5;
    render();

    function render(){
        $.ajax({
        type: "get",
        url: "/user/queryUser",
        data:{
            page: currentPage,
            pageSize: pageSize
        },
        dataType:"json",
        success:function(info){
            console.log(info);
            var htmlStr = template("tpl",info);
            $('tbody').html(htmlStr);

            $('#paginator').bootstrapPaginator({
                bootstrapMajorVersion: 3,
                currentPage:info.page,
                totalPages:Math.ceil(info.total/info.size),

                onPageClicked: function(a,b,c,page){
                    currentPage = page;

                    render();
                }
            })
        } 
    })
    }

    
    $('tbody').on("click",".btn",function(){
        //退出模态框
        console.log("111");
        $('#userModal').modal("show");

        // 获取当前用户的id
        currentId = $(this).parent().data("id");

        //获取用户修改的状态
        isDelete = $(this).hasClass("btn-danger") ? 0 : 1;
    });

    //发送请求修改状态
    $("#submitBtn").click(function(){
        $.ajax({
            type: "post",
            url: "/user/updateUser",
            data:{
                id: currentId,
                isDelete: isDelete
            },
            dataType: "json",
            success:function(info){
                if(info.success){
                    $("#userModal").modal("hide");
                    render();
                }
            }
        })
    })
    
})