$(function(){
    var currentPage = 1;
    var pageSize = 5;

    render();

    function render(){
        $.ajax({
            type:"get",
            url:"/category/querySecondCategoryPaging",
            data:{
                page:currentPage,
                pageSize:pageSize
            },
            dataType: "json",
            success:function(info){
                var htmlStr = template("secondTpl",info);
                $("tbody").html(htmlStr);

                $('#paginator').bootstrapPaginator({
                    bootstrapMajorVersion: 3,  // 版本号
                    currentPage: info.page,  // 当前页
                    totalPages: Math.ceil( info.total / info.size ), // 总页数
                    onPageClicked: function( a, b, c, page ) {
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
    $("#addBtn").click(function(){
        $("#addModal").modal("show");

        $.ajax({
            type: "get",
            url: "/category/queryTopCategoryPaging",
            data:{
                page : 1,
                pageSzie : 100
            },
            dataType:"json",
            success: function (info) {
                var htmlStr = template("dropdownTpl",info);
                $(".dropdown-menu").html(htmlStr);
            }
        })
    })

    //给所有的下拉菜单添加点击事件(事件委托)
    $(".dropdown-menu").on("click","a",function(){
        var txt = $(this).text();
        $("#dropdownText").text(txt);
    });

    $("#fileupload").fileupload({
        dataType: "json",
        //e：事件对象
        //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
        done:function (e, data) {
          console.log(data);
          var picUrl = data.result.picAddr;
          $("#imgBox img").attr("src",picUrl);
        }
    })
})