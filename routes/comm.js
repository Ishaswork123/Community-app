const express=require('express');
const router=express.Router();

const Community=require('../Model/community');


// router.get("/login", (req, res) => {
//     res.render("login_1");
//   });
  
// //   **Handle User Login (POST)**
//   router.post("/login", async (req, res) => {
//     const { username } = req.body;
//     if (!username) {
//       return res.render("login", { error: "Username is required" });
//     }
//     req.session.username = username;
//     res.redirect("/dashboard");
//   });
  
  // **Render Dashboard**
  router.get("/dashboard", async (req, res) => {
    if (!req.session.username) {
      return res.redirect("/");
    }
  
    const communities = await Community.find({});
    res.render("login_1", { username: req.session.username, communities });
  });
  
  // **Create a New Community (POST)**
  router.post("/dashboard", async (req, res) => {
    const {  communityName, bio, createUserName} = req.body;
  
    if (!communityName || !username) {
      return res.render("login_1", { error: "All fields are required" });
    }
  
    const newCommunity = new Community({
      communityName,
      bio,
      users: [{ userId: createUserName,createUserName}],
      totalUsers: 1,
    });
  
    await newCommunity.save();
    res.redirect("/std/dashboard");
  });
  
  // **Join an Existing Community**
  router.post("/join-community", async (req, res) => {
    const { communityId, username } = req.body;
  
    const community = await Community.findById(communityId);
    if (!community) {
      return res.redirect("/std/dashboard");
    }
  
    // Check if user is already a member
    const isUserInCommunity = community.users.some(
      (user) => user.username === username
    );
  
    if (!isUserInCommunity) {
      community.users.push({ userId: username, username });
      community.totalUsers += 1;
      await community.save();
    }
  
    res.redirect(`/std/community/${communityId}`);
  });
  
  // **Render Community Chat Page**
  router.get("/community/:id", async (req, res) => {
    if (!req.session.username) {
      return res.redirect("/");
    }
  
    const community = await Community.findById(req.params.id);
    if (!community) {
      return res.redirect("/dashboard");
    }
  
    res.render("screen", { username: req.session.username, community });
  });
  
  // **Send Message to Community**
  router.post("/send-message", async (req, res) => {
    const { communityId, message, username } = req.body;
  
    if (!message || !username) {
      return res.redirect(`/community/${communityId}`);
    }
  
    const community = await Community.findById(communityId);
    if (!community) {
      return res.redirect("/dashboard");
    }
  
    const newMessage = {
      senderId: username,
      content: message,
      timestamp: new Date(),
    };
  
    community.messages.push(newMessage);
    await community.save();
  
    res.redirect(`/community/${communityId}`);
  });
  
  // **Logout Route**
  router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/");
  });
  





module.exports=router;