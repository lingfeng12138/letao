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

    
    
})