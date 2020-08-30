// pages/add/add.js
const DB = wx.cloud.database().collection("stu_table")
let name = ""
let week = ""
let time = ""
let teacher = ""
let classroom=""
Page({
  // 多路选择器
  data: {
    timeArray: [
      ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      ['第1节', '第2节', '第3节', '第4节', '第5节']
    ],
    objectTimeArray: [
      [{
          id: 1,
          name: '周一'
        },
        {
          id: 2,
          name: '周二'
        },
        {
          id: 3,
          name: '周三'
        },
        {
          id: 4,
          name: '周四'
        },
        {
          id: 5,
          name: '周五'
        },
        {
          id: 6,
          name: '周六'
        },
        {
          id: 7,
          name: '周日'
        },
      ],
      [{
          id: 1,
          name: '第1节'
        },
        {
          id: 2,
          name: '第2节'
        },
        {
          id: 3,
          name: '第3节'
        },
        {
          id: 4,
          name: '第4节'
        },
        {
          id: 5,
          name: '第5节'
        },
      ]
    ],
    timeIndex: [1, 1],

    multiArray: [
      ['实', '教'],
      ['A', 'B', 'C', 'D'],
      ['1', '2', '3', '4', '5'],
      ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10']
    ],
    objectMultiArray: [
      [{
          id: 0,
          name: '实'
        },
        {
          id: 1,
          name: '教'
        }
      ],
      [{
          id: 0,
          name: 'A'
        },
        {
          id: 1,
          name: 'B'
        },
        {
          id: 2,
          name: 'C'
        },
        {
          id: 3,
          name: 'D'
        }
      ],
      [{
          id: 0,
          name: '1'
        },
        {
          id: 1,
          name: '2'
        },
        {
          id: 2,
          name: '3'
        },
        {
          id: 3,
          name: '4'
        },
        {
          id: 4,
          name: '5'
        },
      ],
      [{
          id: 0,
          name: '01'
        },
        {
          id: 1,
          name: '02'
        },
        {
          id: 2,
          name: '03'
        },
        {
          id: 3,
          name: '04'
        },
        {
          id: 4,
          name: '05'
        },
        {
          id: 5,
          name: '06'
        },
        {
          id: 6,
          name: '07'
        },
        {
          id: 7,
          name: '08'
        },
        {
          id: 8,
          name: '09'
        },
        {
          id: 9,
          name: '10'
        },
      ]
    ],
    multiIndex: [0, 0, 0, 0],
  },

  // 获取用户输入的信息
  addName(event) {
    name = event.detail.value
  },
  addWeek(event) {
    week = event.detail.value
  },
  addTime(event) {
    time = event.detail.value
  },
  addTeacher(event) {
    teacher = event.detail.value
  },


  bindTimePickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    // this.setData({
    //   timeIndex: e.detail.value
    // })
    // var data = {
    //   timeArray: this.data.timeArray,
    //   timeIndex: this.data.timeIndex
    // };
    // console.log(data.timeIndex);
    this.setData({ timeIndex: e.detail.value})
    time = (e.detail.value[0] + 1) * 10 + (e.detail.value[1] + 1)
    console.log(time)
  },
  bindTimePickerColumnChange: function(e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    // var data = {
    //   timeArray: this.data.timeArray,
    //   timeIndex: this.data.timeIndex
    // };
    // console.log(data.timeIndex);
    // time = (data.timeIndex[0]+1)*10 + (data.timeIndex[1]+1)
    // console.log(time)
  },

  bindMultiPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let mulIndex = e.detail.value;
    let value1 = this.data.multiArray[0][mulIndex[0]]
    let value2 = this.data.multiArray[1][mulIndex[1]]
    let value3 = this.data.multiArray[2][mulIndex[2]]
    let value4 = this.data.multiArray[3][mulIndex[3]]
    console.log(value1+value2+"-"+value3+value4)
    this.setData({
      multiIndex: e.detail.value
    })
  },
  bindMultiPickerColumnChange: function(e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case 0:
            data.multiArray[1] = ['A', 'B', 'C', 'D'];
            data.multiArray[2] = ['1', '2', '3', '4', '5'];
            data.multiArray[3] = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'];
            break;
          case 1:
            data.multiArray[1] = ['A', 'B', 'C', ];
            data.multiArray[2] = ['1', '2', '3', '4', '5'];
            data.multiArray[3] = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'];
            break;
        }
        data.multiIndex[1] = 0;
        data.multiIndex[2] = 0;
        break;
      case 1:
        switch (data.multiIndex[0]) {
          case 0: //教
            switch (data.multiIndex[1]) {
              case 0: //实A
                data.multiArray[2] = ['1', '2', '3', '4', '5'];
                data.multiArray[3] = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'];
                break;
              case 1: //实B
                data.multiArray[2] = ['1', '2', '3', '4', '5'];
                data.multiArray[3] = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'];
                break;
              case 2: //实C
                data.multiArray[2] = ['1', '2', '3', '4', '5'];
                data.multiArray[3] = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'];
                break;
              case 3: //实D
                data.multiArray[2] = ['1', '2', '3', '4', '5'];
                data.multiArray[3] = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'];
                break;
            }
            break;
          case 1: //实

            switch (data.multiIndex[1]) {
              case 0: //教A
                data.multiArray[2] = ['1', '2', '3'];
                data.multiArray[3] = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'];
                break;
              case 1: //教B
                data.multiArray[2] = ['1', '2', '3', '4'];
                data.multiArray[3] = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'];
                break;
              case 2: //教C
                data.multiArray[2] = ['1', '2', '3', '4'];
                data.multiArray[3] = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'];
                break;
            }
            break;
        }
        data.multiIndex[2] = 0;
        break;
    }
    console.log(data.multiArray);
        this.setData(data);
    classroom = data.multiArray
    console.log(classroom);
  },

  // 提交按钮
  submit() {
    // 对星期进行拆分
    // function parseFn(str) {
    //   if (!str) return undefined;
    //   let arr = str.split('周')
    //   let arr1 = arr[0].split(',')
    //   console.log(arr1)
    //   let arr2 = arr1.reduce((pre, item, i) => {
    //     let temparr = item.split('-')

    //     for (let i = parseInt(temparr[0]); i <= parseInt(temparr[1]); i++) {
    //       pre.push(i)
    //     }
    //     return pre

    //   }, [])
    //   //console.log(arr2)
    //   return arr2
    // }
    DB.add({
      data: {
        name: name,
        week: week,
        time: time,
        teacher: teacher,
        classroom: classroom
      },
      success(res) {
        console.log("添加成功", res)
      },
      fail(res) {
        console.log("添加失败！", res)
      }
    })
  },
  getData() {
    DB.get({
      success(res) {
        console.log("查询成功", res)
      }
    })
  },


})