// pages/adminset/adminset.js
Page({
  to_instruction(){
    wx.navigateTo({
      url: '../instruction/instruction'
    })
  },
 to_admin() {
    wx.navigateTo({
      url: '../admin/admin'
    })
  }
})