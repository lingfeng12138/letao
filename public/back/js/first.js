$(function(){
    var currentPage = 1;
    var pageSize = 5;
    render();

    function render(){
        $.ajax({
            type:"get",
            url:'/category/queryTopCategoryPaging',
            data:{
                page:currentPage,
                pageSize:pageSize
            },
            dataType:"json",
            success:function(info){
                console.log(info);
                var htmlStr = template("firstTpl",info);
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
    $('#addBtn').click(function () {
        $("#addModal").modal("show");
   })
        //校验配置
        $('#form').bootstrapValidator({
            // 配置图标
            feedbackIcons: {
              valid: 'glyphicon glyphicon-ok',    // 校验成功
              invalid: 'glyphicon glyphicon-remove',   // 校验失败
              validating: 'glyphicon glyphicon-refresh'  // 校验中
            },
            // 校验字段, 一定要先配置 input 的 name
            fields: {
              categoryName: {
                validators: {
                  notEmpty: {
                    message: "请输入一级分类名称"
                  }
                }
              }
            }
          });

    //注册表单校验成功的事件，阻止默认提交，通过ajax提交
    $("#form").on("success.form.bv",function(e){
        e.preventDefault();

        //通过ajax提交
        $.ajax({
            type:"post",
            url:"/category/addTopCategory",
            data:$("#form").serialize(),
            dataType:"json",
            success:function(info){
                if(info.success){
                    $("#addModal").modal("hide");

                    //重新渲染第一页
                    currentPage = 1;
                    render();

                    //重置表单内容，内容和状态都重置
                    $('#form').data("bootstrapValidator").resetForm(true);
                }
            }
        })
    })


 
})