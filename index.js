const allData={};
function getAllData() {
    return new Promise(function (resolve) {
        $.ajax({
            url: '//api.github.com/gists/a88b4d5ee4e5c0cfa28c725a453e5cd5/comments',
            type: 'GET',
            dataType: 'jsonp',
            success: function (data) {
                const arr = data.data.map((comment) => {
                    try {
                        const info = JSON.parse(comment.body);
                        return info;
                    } catch (e) {
                        return {};
                    }
                });
                resolve(arr);
            }
        });
    });
}
function getKindData(kind){
    let ret='';
    const data=allData[kind];
    const arr=Object.keys(data).sort((a,b)=>data[b]-data[a]);
    const sum=arr.reduce((p,v)=>{
        return p+data[v];
    },0);
    arr.forEach((v)=>{
        let percent=data[v]/sum*100;
        percent=(percent+"").match(/\d+(\.\d)?/)[0];
        ret+=`${v}:${data[v]}(${percent}%)\n`;
    });
    return ret;
}
getAllData().then((data)=>{
    
    function appendData(kind,value){        
        if(!allData[kind]){
            allData[kind]={};
        }
        if(!allData[kind][value]){
            allData[kind][value]=0;
        }
        allData[kind][value]++;
    }
    data.forEach((map)=>{
        Object.keys(map).forEach((kind,i)=>{
            const value=map[kind];
            if(Array.isArray(value)){
                value.forEach((v)=>{
                    appendData(kind,v);
                });
            }else if(typeof value==='string'){
                appendData(kind,value);
            }            
        });
    });
    const $optionsWrap=$(".options-wrap");
    const $questionWrap=$(".question-wrap");
    const $output=$('.output');
    for(const kind in allData){
        const $button=$('<button class="option"></button>');
        $button.text(kind).data("value",kind);
        $optionsWrap.append($button);
    }
    $optionsWrap.on("click",'.option',function(){
        const kind=$(this).data("value");
        $questionWrap.find("input").val(kind);
        $output.text(getKindData(kind))

    });
});