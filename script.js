const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const widthicon = document.querySelector('.widthimg');
const widthbar = document.querySelector('.bar');
const toodler = document.querySelector('.toodler');
const divbar = document.querySelector('.bardiv');
const pencil = document.querySelector('.pencil img');
const eraser = document.querySelector('.eraser img');
const fill = document.querySelector('.fill img');
let imageData;
let execute = false;
let l = false;
const lvls = [950,980,1010,1040,1070];
ctx.lineWidth = 5;

let vis = new Array(501);

for (let i=0;i<501;i++){
    vis[i] = new Array(901);
}

function Convert(x,y){
    return (y*900+x)*4+3;
}

widthicon.addEventListener('click',(e)=>{
    if(e.target.tagName == "IMG"){
        e.target.classList.toggle('active');
        if (e.target.classList.contains('active')){
            e.target.style.borderColor = 'black';
            widthbar.style.backgroundColor = 'black';
            toodler.style.display = 'block';
        }
        else {
            widthbar.style.backgroundColor = 'white';
            toodler.style.display = 'none';
            e.target.style.borderColor = 'white';
        }
    }
});
divbar.addEventListener('click',(e)=>{
    e.preventDefault();
    if (e.target.classList.contains('bardiv') || e.target.classList.contains('bar')){
        const lleft = e.pageX;
        let minn = 10000;
        let _item = 0;
        let ind = 0;
        lvls.forEach((item,index)=>{
            if (Math.abs(item-lleft) <= minn){
                minn = Math.abs(item-lleft); 
                _item = item;
                ind = index;
            }
        });
        toodler.style.left = `${_item}px`;
        ctx.lineWidth = ind+1;
    }
});

divbar.addEventListener('mousedown',(e)=>{
    e.preventDefault();
    if (e.which == 1){
        if (e.target.classList.contains('toodler')){
            execute = true;
        }
    }
});

document.addEventListener('mousemove',(e)=>{
    e.preventDefault();
    if (execute == true){
        if (e.pageX<950){
            toodler.style.left = `${950}px`; 
        }
        else if (e.pageX>1070){
            toodler.style.left = `${1070}px`; 
        }
        else {
            toodler.style.left = `${e.pageX}px`; 
        }  
    }
});

document.addEventListener('mouseup',(e)=>{
    e.preventDefault();
    if (execute == true){
        const lleft = e.pageX;
        let minn = 10000;
        let _item = 0;
        let ind = 0;
        lvls.forEach((item,index)=>{
            if (Math.abs(item-lleft) <= minn){
                minn = Math.abs(item-lleft); 
                _item = item;
                ind = index;
            }
        });
        toodler.style.left = `${_item}px`;
        ctx.lineWidth = ind+1;
        execute = false;
    }
});


pencil.addEventListener('click',()=>{
    pencil.classList.add('active');
    ctx.strokeStyle = 'black';
    if (eraser.classList.contains('active')){
        eraser.classList.remove('active');
    }
    if (fill.classList.contains('active')){
        fill.classList.remove('active');
    }
});
eraser.addEventListener('click',()=>{
    eraser.classList.add('active');
    ctx.strokeStyle = 'white';
    if (pencil.classList.contains('active')){
        pencil.classList.remove('active');
    }
    if (fill.classList.contains('active')){
        fill.classList.remove('active');
    }
});
fill.addEventListener('click',()=>{
    fill.classList.add('active');
    if (eraser.classList.contains('active')){
        eraser.classList.remove('active');
    }
    if (pencil.classList.contains('active')){
        pencil.classList.remove('active');
    }
});


canvas.addEventListener('mousemove',(e)=>{
    if (!fill.classList.contains('active')){
        if (l == true){
            if (eraser.classList.contains('active')){
                const temp = ctx.lineWidth;
                ctx.lineWidth = ctx.lineWidth*5; 
                ctx.lineTo(e.pageX-8,e.pageY-8);
                ctx.moveTo(e.pageX-8,e.pageY-8);
                ctx.stroke();
                ctx.lineWidth = temp;
            }
            else {
                ctx.lineTo(e.pageX-8,e.pageY-8);
                ctx.moveTo(e.pageX-8,e.pageY-8);
                ctx.stroke();
            }
        }
    }
});
canvas.addEventListener('mousedown',(e)=>{
    if (!fill.classList.contains('active')){
        ctx.beginPath();
        l = true;
        ctx.moveTo(e.pageX-8,e.pageY-8);
    }
});
canvas.addEventListener('mouseup',()=>{
    if (!fill.classList.contains('active')){
        l = false;
        ctx.closePath();
    }
});


canvas.addEventListener('click',(e)=>{
    if (fill.classList.contains('active')){
        e.pageX-=8;
        e.pageY-=8;
        imageData = ctx.getImageData(0, 0, 900, 500);
        for (let i=0;i<501;i++){
            for (let j=0;j<901;j++){
                vis[i][j] = 0;
            }
        }
        let queuex = [];
        let queuey = [];
        queuex.unshift(e.pageY);
        queuey.unshift(e.pageX);
        vis[e.pageY][e.pageX] = 1;
        while(queuex.length>0){
            let x = queuex[0];
            let y = queuey[0];
            imageData.data[Convert(y,x)] = 255;
            if (x+1<500 && vis[x+1][y]==0 && imageData.data[Convert(y,x+1)] == 0){
                queuex.push(x+1);
                queuey.push(y);
                vis[x+1][y] = 1;
            }
            if (x-1>=0 && vis[x-1][y]==0 && imageData.data[Convert(y,x-1)] == 0){
                queuex.push(x-1);
                queuey.push(y);
                vis[x-1][y] = 1;
            }
            if (y+1< 900 && vis[x][y+1]==0 && imageData.data[Convert(y+1,x)] == 0){
                queuex.push(x);
                queuey.push(y+1);
                vis[x][y+1] = 1;
            }
            if (y-1>=0 && vis[x][y-1]==0 && imageData.data[Convert(y-1,x)] == 0){
                queuex.push(x);
                queuey.push(y-1);
                vis[x][y-1] = 1;
            }
            queuex.shift();
            queuey.shift();
        }
        ctx.putImageData(imageData,0,0);
    }
});