const mongoose=require('mongoose')

mongoose.connect('mongodb://localhost/POS-Shop',{ useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>console.log("Connected to mongo DB"))
.catch(err=>console.error("Could not connect to mongo DB ...",err));

const userschema= new mongoose.Schema(
    {
        username:String,
        password:String,
        usertype:String
    }
);

const User=mongoose.model('user',userschema)

async function showalluser()
{
    const allusers = await User.find({});
    return allusers;
}

async function register(user1,pass1){
    const r = await User.find({username:user1});
    if(r.length != 0) 
    {
        return false
    }
   
    else
    {
      const createuser = new User({
         username:user1,
         password:pass1,
         usertype:"Customer"
      });
      const result = await createuser.save();
      return true;
    
    }
  };


  async function updateuser(user1,usertype){
    const r = await User.updateOne({
      username : user1
    },
    {
      $set :
      {
        usertype
      }
    })
    return r
  };


  async function changpassword(user1,oldpass,newpass){
    let user = await User.find({username:user1,password:oldpass});
    if(user.length != 0) 
    {
      const r = await User.updateOne({
        username : user1
      },
      {
        $set :
        {
          password:newpass
        }
      })
      return true
    }
   
    else
    {
      return false;
    }
  };

async function deleteuser(user1){
    const result = await User.deleteOne({ username:user1});
    return result;
};

async function login(user1,pass1)
  {
    const user = await User.find({username:user1,password:pass1});
    return user;
  }

  async function showusertype(user1)
  {
    const user = await User.find({username:user1});
    return user;
  }

  module.exports.register = register;
  module.exports.login = login;
  module.exports.showalluser = showalluser;
  module.exports.updateuser = updateuser;
  module.exports.deleteuser = deleteuser;
   module.exports.changpassword = changpassword;
   module.exports.showusertype = showusertype;