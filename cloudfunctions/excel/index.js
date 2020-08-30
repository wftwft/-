 // 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'timetable-20bnz'
})
var xls = require('node-xlsx');
const db = cloud.database()

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
  const wxContext = await cloud.getWXContext()
  let {
    fileID
  } = event
  console.log(1)
  //1,通过fileID下载云存储里的excel文件
  const res = await cloud.downloadFile({
    fileID: fileID,
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
      title: data[2][i + 2] ? data[2][i + 2].replace(/\(.*?\)/, "") : undefined,
      classroom: data[3][i + 2],
      teacher: data[4][i + 2],
      course: parseFn(data[5][i + 2])
    }
    week[i][2] = {
      title: data[10][i + 2] ? data[10][i + 2].replace(/\(.*?\)/, "") : undefined,
      classroom: data[11][i + 2],
      teacher: data[12][i + 2],
      course: parseFn(data[13][i + 2])
    }
    week[i][3] = {
      title: data[19][i + 2] ? data[19][i + 2].replace(/\(.*?\)/, "") : undefined,
      classroom: data[20][i + 2],
      teacher: data[21][i + 2],
      course: parseFn(data[22][i + 2])
    }
    week[i][4] = {
      title: data[27][i + 2] ? data[27][i + 2].replace(/\(.*?\)/, "") : undefined,
      classroom: data[28][i + 2],
      teacher: data[29][i + 2],
      course: parseFn(data[30][i + 2])
    }
    week[i][5] = {
      title: data[36][i + 2] ? data[36][i + 2].replace(/\(.*?\)/, "") : undefined,
      classroom: data[37][i + 2],
      teacher: data[38][i + 2],
      course: parseFn(data[39][i + 2])
    }
  }
  console.log({ week, '_openid': wxContext.OPENID })
  await db.collection('text').add({ data: { week, '_openid': wxContext.OPENID, pubtime: new Date().getTime()}})
  return { week, '_openid': wxContext.OPENID };
}
