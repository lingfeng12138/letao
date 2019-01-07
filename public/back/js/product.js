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
                pageSize:pageSize,
                page:currentPage
            },
            dataType:"json",
            success:function(info){
                console.log(info);
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

    //添加按钮
    $("#addBtn").click(function(){
        $("#addModal").modal("show");

        $.ajax({
            type: "get",
            url: "/category/querySecondCategoryPaging",
            data:{
                pageSize:100,
                page:1
            },
            dataType:"json",
            success:function(info){
                console.log(info + "二级分类success");
                var htmlStr = template("dropdownTpl",info);
                $(".dropdown-menu").html(htmlStr);


            }
        })
    })

    //给下拉菜单a注册点击事件
    $(".dropdown-menu").on("click","a",function(){
        var txt =  $(this).text();
        $("#dropdownText").text(txt);

        //隐藏域
        var id = $(this).data("id");
        $("[name='brandId']").val(id);

        //更新数据
        $('#form').data("bootstrapValidator").updateStatus("brandId", "VALID");
    })

    // 配置多文件上传
    $("#fileupload").fileupload({
        dataType:"json",
        //e：事件对象
        //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
        done:function (e, data) {
          var picObj = data.result;
          picArr.unshift(picObj);
          var picUrl = picObj.picAddr;
          $("#imgBox").prepend('<img style="width: 100px;" src="'+ picUrl +'" alt="">');

          if(picArr.length > 3){
              picArr.pop();
              $("#imgBox img:last-of-type").remove();
          }
          if(picArr.length === 3){
            $('#form').data("bootstrapValidator").updateStatus("picStatus", "VALID");
          }
        }
  });

  // 配置表单校验
  $('#form').bootstrapValidator({
    // 配置不校验的类型, 对 hidden 需要进行校验
    excluded: [],

    // 配置图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',  
      invalid: 'glyphicon glyphicon-remove',   
      validating: 'glyphicon glyphicon-refresh' 
    },

    // 配置校验字段
    fields: {
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

  $("#form").on("success.form.bv",function(e){
        e.preventDefault();

       var paramsStr = $("#form").serialize();
       //拼接上图片的数据
       paramsStr +=  "&picArr=" + JSON.stringify(picArr); 

       $.ajax({
           type:"post",
           url: "/product/addProduct",
           data:paramsStr,
           dataType: "json",
           success:function(info){
               if(info.success){
                   $("#addModal").modal("hide");
               currentPage : 1;
               render();
               $('#form').data("bootstrapValidator").resetForm(true);

               $('#dropdownText').text("请选择二级分类");
               $("#imgBox img").remove();
           }  
        }
       })
  })
})