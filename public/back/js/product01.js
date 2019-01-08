$(function(){
    var currentPage = 1;
    var pageSize = 2;
    var picArr = [];

    render();
    function render(){
        $.ajax({
            type: "get",
            url: "/product/queryProductDetailList",
            data:{
                page:currentPage,
                pageSize: pageSize
            },
            dataType: "json",
            success:function (info) {
                var htmlStr = template("productTpl",info);
                $("tbody").html(htmlStr);

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

    //渲染二级分类
    $("#addBtn").click(function(){
        $("#addModal").modal("show");

        $.ajax({
            type:"get",
            url : "/category/querySecondCategoryPaging",
            dataType: "json",
            data:{
                page:1,
                pageSize: 100
            },
            success:function(info){
                var htmlStr = template("dropdownTpl",info);
                $(".dropdown-menu").html(htmlStr);
            }
        })
    })

    //给a添加点击事件
    $(".dropdown-menu").on("click","a",function(){
        var txt = $(this).text();
        $("#dropdownText").text(txt);

        //隐藏域
        var id = $(this).data("id");
        $("[name='brandId']").val(id);

        $('#form').data("bootstrapValidator").updateStatus("brandId", "VALID");
    })

    // 多文件上传
    $("#fileupload").fileupload({
        dataType:"json",
        //e：事件对象
        //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
        done:function (e, data) {
        //   console.log(data);
        var picPro = data.result;
        picArr.unshift(picPro);
        var picUrl = picPro.picAddr;

        $("#imgBox").prepend('<img style="height: 100px;" src="'+ picUrl +'" alt="">');

        if(picArr.length > 3){
            picArr.pop();
            $("#imgBox img:last-of-type").remove();
        }
        if(picArr.length === 3){
            $('#form').data("bootstrapValidator").updateStatus("picStatus", "VALID");
        }
        }
  });


  $("form").bootstrapValidator({
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
      brandId: {
        validators: {
          notEmpty: {
            message: "请选择二级分类"
          }
        }
      },
      proName: {
        validators: {
          notEmpty: {
            message: "请输入商品名称"
          }
        }
      },
      proDesc: {
        validators: {
          notEmpty: {
            message: "请输入商品描述"
          }
        }
      },
      num: {
        validators: {
          notEmpty: {
            message: "请输入商品库存"
          },
          regexp: {
            regexp: /^[1-9]\d*$/,
            message: '商品库存格式, 必须是非零开头的数字'
          }
        }
      },
      size: {
        validators: {
          notEmpty: {
            message: "请输入商品尺码"
          },
          // 要求: 必须是 xx-xx 的格式, xx为两位的数字
          regexp: {
            regexp: /^\d{2}-\d{2}$/,
            message: '必须是 xx-xx 的格式, xx为两位的数字, 例如: 36-63'
          }
        }
      },
      oldPrice: {
        validators: {
          notEmpty: {
            message: "请输入商品原价"
          }
        }
      },
      price: {
        validators: {
          notEmpty: {
            message: "请输入商品现价"
          }
        }
      },
      picStatus: {
        validators: {
          notEmpty: {
            message: "请上传三张图片"
          }
        }
      }
    }
  
  });
//渲染商品
  $("#form").on('success.form.bv', function (e) {
    e.preventDefault();

    var paramsStr = $("form").serialize();
    paramsStr += "&picArr=" + JSON.stringify(picArr); 
    //使用ajax提交逻辑
    $.ajax({
        type: "post",
        url: "/product/addProduct",
        data:paramsStr,
        dataType: "json",
        success:function(info){
            if(info.success){
                $("#addModal").modal("hide");
                currentPage = 1;
                render();
                $("#form").data("bootstrapValidator").resetForm(true);
                $("#dropdownText").text("请输入二级分类名称");
                $("#imgBox img").remove();
            }
        }
    })
});

    
})