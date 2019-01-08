$(function () {
    var currentPage = 1;
    var pageSize = 5;

    render();

    function render() {
        $.ajax({
            type: "get",
            url: "/category/querySecondCategoryPaging",
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: "json",
            success: function (info) {
                var htmlStr = template("secondTpl", info);
                $("tbody").html(htmlStr);

                $('#paginator').bootstrapPaginator({
                    bootstrapMajorVersion: 3, // 版本号
                    currentPage: info.page, // 当前页
                    totalPages: Math.ceil(info.total / info.size), // 总页数
                    onPageClicked: function (a, b, c, page) {
                        // 更新当前页
                        currentPage = page;
                        // 重新渲染
                        render();
                    }
                })
            }
        })
    }

    //添加模态框
    $("#addBtn").click(function () {
        $("#addModal").modal("show");

        $.ajax({
            type: "get",
            url: "/category/queryTopCategoryPaging",
            data: {
                page: 1,
                pageSzie: 100
            },
            dataType: "json",
            success: function (info) {
                var htmlStr = template("dropdownTpl", info);
                $(".dropdown-menu").html(htmlStr);
            }
        })
    })

    //给所有的下拉菜单添加点击事件(事件委托)
    $(".dropdown-menu").on("click", "a", function () {
        var txt = $(this).text();
        $("#dropdownText").text(txt);

        //隐藏域
        var id = $(this).data("id");
        $("[name='categoryId']").val(id);

        $("#form").data("bootstrapValidator").updateStatus("categoryId","VALID");
    });

    $("#fileupload").fileupload({
        dataType: "json",
        //e：事件对象
        //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
        done: function (e, data) {
            console.log(data);
            var picUrl = data.result.picAddr;
            $("#imgBox img").attr("src", picUrl);

            $("[name='brandLogo']").val(picUrl);
            $("#form").data("bootstrapValidator").updateStatus("brandLogo","VALID");
        }
    })

    $("#form").bootstrapValidator({
        //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
        excluded: [],

        //2. 指定校验时的图标显示，默认是bootstrap风格
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },

        //3. 指定校验字段
        fields: {
            //校验用户名，对应name表单的name属性
            categoryId: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '一级分类不能为空'
                    }
                }
            },
            brandName: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '请输入二级分类'
                    }
                }
            },
            brandLogo: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '请选择图片'
                    }
                }
            }
        }
    });

    //
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
                    // console.log(info);
                    $("#addModal").modal("hide");

                    //重新渲染第一页
                    currentPage = 1;
                    render();

                    //重置表单内容，内容和状态都重置
                    $('#form').data("bootstrapValidator").resetForm(true);

                    //下拉菜单和图片不是表单元素，需手动重置
                    $('#dropdownText').text("请选择一级分类");
                    $("#imgBox img").attr("src","../images/huaji.jpeg")
                }
            }
        })
    })
})