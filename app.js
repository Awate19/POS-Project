const {register,login,showalluser,showusertype,updateuser,deleteuser,changpassword}=require('./models/user');
const {showstore,addItem,updateQty,salesQty}=require('./models/items');
const express=require('express')
const path=require('path')
const session=require('express-session')
const mongoose=require('mongoose')
//const index = require('./routes/index');
const app=express()

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.set('views',path.join(__dirname,"views"))
app.set('view engine','ejs')

//app.use('/index',index);
app.use("/css", express.static(__dirname + '/css'));
app.use("/images", express.static(__dirname + '/images'));

app.get('/',(req,res)=>{
    res.render('index',{message:""})
});




app.get('/addnew',async(req,res)=>{
    const items = await showstore();
    let category=[]
    for(var i of items)
    {
     if (category.includes(i.category))
     {
      continue
     }
     else{
         category.push(i.category)
         }
    }
    
    res.render('Admin/addnew',{username:currentuser,message1:'',records:items,catlist:category})

});
app.get('/deleteitem',async(req,res)=>{
    const items = await showstore();
    let category=[]
    for(var i of items)
    {
     if (category.includes(i.category))
     {
      continue
     }
     else{
         category.push(i.category)
         }
    }
    
    res.render('Admin/deleteitem',{username:currentuser,message1:'',records:items,catlist:category})
});


app.get('/updateuser',async(req,res)=>{
    const users = await showalluser();
    res.render('Admin/updateuser',{username:currentuser,message1:'',records:users})
});

app.get('/stock',async(req,res)=>{
    const items = await showstore();
    let result= await showusertype(currentuser);
   
    if(result[0].usertype==="Admin")
    {
        res.render('Admin/stock',{username:currentuser,message1:'',records:items})
    }
    else
    {
        res.render('stock',{username:currentuser,message1:'',records:items})
    }




    res.render('stock',{username:currentuser,message1:'',records:items})
});

app.get('/deleteuser',async(req,res)=>{
    const users = await showalluser();
    res.render('Admin/deleteuser',{username:currentuser,message:'',records:users})
});

app.get('/purchase',async(req,res)=>{
    const items = await showstore();
    res.render('Admin/purchase',{username:currentuser,message1:'',records:items})
});
let currentuser;


app.get('/sales',async(req,res)=>{
    
    const items = await showstore();
    let category=[]
    for(var i of items)
    {
     if (category.includes(i.category))
     {
      continue
     }
     else{
         category.push(i.category)
         }
    }

    let result= await showusertype(currentuser);
    if(result[0].usertype==="Admin")
    {
    res.render('Admin/sales',{username:currentuser,message1:'',records:items,catlist:category})
    }
    else
    {
    res.render('sales',{username:currentuser,message1:'',records:items,catlist:category})
    }
    
});

app.get('/register',(req,res)=>{
    res.render('register',{message:''})
});

app.get('/changepassword',async(req,res)=>{
    let result= await showusertype(currentuser);
    if(result[0].usertype==="Admin")
    {
    res.render('Admin/changepassword',{message:'',username:currentuser});
    }
    else
    {
        res.render('changepassword',{message:'',username:currentuser});
    }
});


app.get('/Admin',(req,res)=>{
    res.render('Admin/Admin',{username:currentuser})
});

app.get('/home',(req,res)=>{
    res.render('home',{username:currentuser})
});

app.post('/home',async(req,res)=>{
        const user1=  req.body.username;
        const pass1=  req.body.password;
        const result= await login(user1,pass1);
        currentuser=user1
        if(result.length !=0)
        {
            if(result[0].usertype == "Admin")
            {res.render('Admin/Admin',{username:user1})}
            else
            {res.render('home',{username:user1})}
        }
        else
        {
            res.render('index',{message:"Incorect UserName and Password"})  
        }
     
});




app.post('/register',async(req,res)=>{
    try
    {
    let response = await register(
      req.body.username,
      req.body.password,
    );
    if(response==false)
    {
        res.render('register',{message:"User Already Exist"})  
    }

    else
    {
        res.render('register',{message:"User Registered Succesfully"})
    }
   
    }

    catch(e){res.status(400).send(e.message)}
  
});


app.post('/purchase',async(req,res)=>{
    try
    {
    const items = await showstore();
    const Qtyy = await updateQty(req.body.item,req.body.Qty,);
    res.render('Admin/purchase',{username:currentuser,message1:'Item Purchased Succesfully',records:items})
    }
    catch(e){res.status(400).send(e.message)}
  
});


app.post('/sales',async(req,res)=>{
    try
    {
    const items = await showstore();
    const Qtyy = await salesQty(req.body.item,req.body.Qty,);
    
    let result= await showusertype(currentuser);
    if(result[0].usertype==="Admin")
    {
    res.render('Admin/sales',{username:currentuser,message1:'Item Sold Succesfully',records:items})
    }
    else
    {
    res.render('sales',{username:currentuser,message1:'Item Sold Succesfully',records:items})
    }
    }
    catch(e){res.status(400).send(e.message)}
  
});


app.post('/addnew',async(req,res)=>{
    try
    {
    
        const items = await showstore();
        let category=[]
        for(var i of items)
        {
         if (category.includes(i.category))
         {
          continue
         }
         else{
             category.push(i.category)
             }
        }

    let response = await addItem(
      req.body.category,
      req.body.item,
    );
    if(response==false)
    {
        
        res.render('Admin/addnew',{username:currentuser,message1:'Items Already Exist',records:items,catlist:category})
    }
    else
    {
        
        res.render('Admin/addnew',{username:currentuser,message1:'New Item Added to Stock',records:items,catlist:category})
    }
   
    }

    catch(e){res.status(400).send(e.message)}
  
});

app.post('/updateuser',async(req,res)=>{
    try
    {
    let users = await showalluser();
    let user = await updateuser(
      req.body.username,
      req.body.usertype,
    );
        
    res.render('Admin/updateuser',{username:currentuser,message1:'User privilage Updated',records:users})
    }

    catch(e){res.status(400).send(e.message)}
  
});


app.post('/changepassword',async(req,res)=>{
    try
    {
     let result= await showusertype(currentuser);
    let user = await changpassword(
        currentuser,
        req.body.oldpass,
        req.body.newpass,
    );
    

    if(user===true)
    {
        if(result[0].usertype==='Admin'){
            res.render('Admin/changepassword',{message:'Password Changed !!',username:currentuser});
        }
        else{
    res.render('changepassword',{message:'Password Changed !!',username:currentuser});
    }
}
    else 
    {
   if(result[0].usertype==='Admin'){
            res.render('Admin/changepassword',{message:'Old Password Incorrect',username:currentuser});
        }
        else{
    res.render('changepassword',{message:'Old Password Incorrect',username:currentuser});
    }
    }
   

}
    catch(e){res.status(400).send(e.message)}
  
});

app.post('/deleteuser',async(req,res)=>{
    try
    {
    
    let users = await showalluser();
    let user = await deleteuser(req.body.username);
   
    res.render('Admin/deleteuser',{message:'User Deleted Succesfully !!',records:users,username:currentuser});
       }
    catch(e){res.status(400).send(e.message)}
});

const port = process.env.PORT || 3000;
app.listen( port, () => console.log(`Listening on port ${port}`));