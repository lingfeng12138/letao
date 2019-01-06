$(function(){
    var currentId;
    var isDelete;

    var currentPage = 1;
    var pageSize = 5;
    render();

    function render(){
        $.ajax({
            type: "get",
            url: "/user/queryUser",
            data:{
                page:currentPage,
                pageSize:pageSize
            },
            dataType: "json",
            success: function(info){
                var htmlStr = template("userTpl",info);
                $("tbody").html(htmlStr);

                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion:3,
                    currentPage:info.page,
                    totalPages:Math.ceil(info.total/info.size),

                    onPageClicked:function(a,b,c,page){
                        currentPage = page;
                        render();
                    }
                })
            }
        })
    }
    $("tbody").on("click",".btn",function(){
        $("#userModal").modal("show");

        //获取用户id
        $(this).parent().data("id");
        //获取修改的状态
        isDelete = $(this).hasClass("btn-danger") ? 0 : 1;
    })

    $("#submitBtn").click(function(){
        $.ajax({
            type: "post",
            url: "/user/updateUser",
            data:{
                isDelete: isDelete,
                id:currentId  
            },
            dataType:"json",
            success:function(info){
                if(info.success){
                    $("#userModal").modal("hide");
                    render();
                }
            }
        })
    })
})