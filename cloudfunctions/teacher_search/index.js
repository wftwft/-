// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'timetable-20bnz'
})
var xls = require('node-xlsx');
const db = cloud.database()
const wxContext = cloud.getWXContext()
function parseFn(str) {
  if (!str) return undefined;
  let arr = str.split('周')
  let arr1 = arr[0].split(',')
  console.log(arr1)
  let arr2 = arr1.reduce((pre, item, i) => {
    let temparr = item.split('-')

    for (let i = parseInt(temparr[0]); i <= parseInt(temparr[1]); i++) {
      pre.push(i)
    }
    return pre

  }, [])
  //console.log(arr2)
  return arr2
}

// 云函数入口函数
console.log("0")
exports.main = async (event, context) => {
  let {
    arrFileID
  } = event
  console.log(arrFileID)
  //1,通过fileID下载云存储里的excel文件
  let p = Promise.resolve()
  let courseArr = []
  //从云存储里通过fileid获取和解析文件，并将解析好的对象放到courseArr数组中
  p = arrFileID.reduce(async (prev,item,i)=>{
    await prev;
    console.log(i)
    return new Promise(async (resolve,reject)=>{
      const res = await cloud.downloadFile({
        fileID: item,
      })
      const buffer = res.fileContent
      const tasks = [] //用来存储所有的添加数据操作
      //2,解析excel文件里的数据
      var sheets = xls.parse(buffer); //获取到所有sheets
      let data = sheets[0].data
      console.log(data)
      let week = [{}, {}, {}, {}, {}, {}, {}]
      for (let i = 0; i < 7; i++) {
        week[i][1] = {
          title: data[3][i + 2],
          classroom: data[4][i + 2],
          course: parseFn(data[5][i + 2])
        }
        week[i][2] = {
          title: data[11][i + 2],
          classroom: data[12][i + 2],
          course: parseFn(data[13][i + 2])
        }
        week[i][3] = {
          title: data[20][i + 2],
          classroom: data[21][i + 2],
          course: parseFn(data[22][i + 2])
        }
        week[i][4] = {
          title: data[28][i + 2],
          classroom: data[29][i + 2],
          course: parseFn(data[30][i + 2])
        }
        week[i][5] = {
          title: data[37][i + 2],
          classroom: data[38][i + 2],
          course: parseFn(data[39][i + 2])
        }
      }
      courseArr.push(week)
      resolve()
    })
  },p)
  await p;
  console.log(courseArr)
  //对解析好的课程数组进行循环排查出空的日期，
  let emptyWeek = getEmpty(courseArr)
  console.log(emptyWeek)
  return emptyWeek;
}


function getEmpty(courseArr){
  let week = [{}, {}, {}, {}, {}, {}, {}]
  for (let i = 0; i < 7; i++) {
    week[i][1] = {
      // 通过索引值找出一星期周几第几节课的所有课程，如果其中有1个有课，就设置满课，都没有课设置为空课
      empty: emptyFn(i, 1,courseArr),
    }
    week[i][2] = {
      empty: emptyFn(i, 2, courseArr)
    }
    week[i][3] = {
      empty: emptyFn(i, 3, courseArr)
    }
    week[i][4] = {
      empty: emptyFn(i, 4, courseArr)
    }
    week[i][5] = {
      empty: emptyFn(i, 5, courseArr)
    }
  }
  return week

}
