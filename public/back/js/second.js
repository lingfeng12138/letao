$(function(){
    var currentPage = 1;
    var pageSize = 5;
    render();

    function render() {
        $.ajax({
            type:"get",
            url:"/category/querySecondCategoryPaging",
            data:{
                page:currentPage,
                pageSize: pageSize
            },
            dataType: "json",
            success: function(info){
                // console.log(info);
                var htmlStr = template("secondTpl",info);
                $('tbody').html(htmlStr);

                $('#paginator').bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    currentPage: info.page,
                    totalPages: Math.ceil(info.total/info.size),
                    onPageClicked: function(a,b,c,page){
                        currentPage = page;
                        render();
                    }
                })
            }
        })
    }

    //添加模态框
   
    $("#addBtn").click(function(){
        $("#addModal").modal("show");
        $.ajax({
            type:"get",
            url: "/category/queryTopCategoryPaging",
            data:{
                page: 1,
                pageSize: 100
            },
            dataType: "json",
            success:function (info) {
                // console.log(info);
                var htmlStr = template("dropdownTpl",info);
                $(".dropdown-menu").html(htmlStr);
            }
        })
    });

    //下拉菜单点击
    $(".dropdown-menu").on("click","a",function(){
        var txt = $(this).text();
        $("#dropdownText").text(txt);
    });

    //配置fileupload
    $("#fileupload").fileupload({
        dataType:"json",
        done:function(e,data){
            // console.log(data);
            var picUrl = data.result.picAddr;
            $("#imgBox img").attr("src",picUrl);
        }
    })

    //二级分类数据提交
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
              brandLogo: {
                validators: {
                  notEmpty: {
                    message: "请上传图片"
                  }
                }
              },
            //   categoryId:{
            //     validators: {
            //         notEmpty: {
            //           message: "请选择一级分类"
            //         }
            //       }
            //   },
              brandName:{
                validators: {
                    notEmpty: {
                      message: "请输入二级分类名称"
                    }
                  }
              }
            }
          });
    $("#form").on("success.form.bv",function(e){
        e.preventDefault();

        //通过ajax提交
        $.ajax({
            type:"post",
            url:"/category/addSecondCategory",
            data:$("#form").serialize(),
            dataType:"json",
            success:function(info){
                if(info.success){
                    console.log(info);
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