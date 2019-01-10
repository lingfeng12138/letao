$(function(){
    render();
    //从本地存储中读取历史记录，转成数组返回
    function getHistory() {
        var jsonStr = localStorage.getItem("search_list") || '[]';
        var arr = JSON.parse(jsonStr);
        return arr;
    }
    //获取本地存储的历史记录数组，通过模板渲染
    function render(){
        var arr = getHistory();
        var htmlStr = template('searchTpl',{arr : arr});
        $('.lt_history').html(htmlStr);
    }

    //清空历史记录
    $('.lt_history').on("click",".btn_empty",function(){
        //确认框
        mui.confirm("您确定要清空历史记录吗？","温馨提示",["取消","确认"],function(e){
            if(e.index === 1){
                localStorage.removeItem("search_list");
                render();
            }
        })
    })

    //删除单个
    $('.lt_history').on("click",".btn_delete",function(){
        var index = $(this).data("index");
        var arr = getHistory();
        arr.splice(index,1);
        localStorage.setItem("search_list",JSON.stringify(arr));
        render();
    })

    //添加历史记录
    $('.search_btn').click(function(){
        var key = $('.search_input').val().trim();
        if(key === ""){
            mui.toast("请输入搜索关键字");
            return;
        }

        //获取数组
        var arr = getHistory();

        //重复的删除旧的，添加到第一位
        var index = arr.indexOf(key);
        if(index !== -1 ){
            //删除
            arr.splice(index , 1);
        }
        //长度不超过10，多则删除
        if(arr.length >= 10){
            arr.pop();
        }

        //添加至数组最前
        arr.unshift(key);

        //转成jsonStr存储到本地
        localStorage.setItem("search_list",JSON.stringify(arr));

        render();

        //清空 input
        $(".search_input").val("");
    })
})