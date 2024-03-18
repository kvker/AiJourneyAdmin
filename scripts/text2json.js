/**
 * 将复制出来的EXCEL数据转成JSON数组
 */

const fs = require('fs')

fs.readFile('1.txt', 'utf8', (err, data) => {
  if(err) console.error(err)
  else {
    const arr = data.split('\n')
    console.log(arr.length)
    const json = []
    let obj = {}
    arr.forEach(item => {
      // console.log(item)
      const [name, introduce, lnglat] = item.split('\t')
      if(!name) return
      const [longitude, latitude] = lnglat.replace('经度:', '').replace('纬度:', '').split(', ')
      obj = {
        name,
        innerName: name,
        introduce,
        lnglat: {
          longitude: parseFloat(longitude),
          latitude: parseFloat(latitude)
        },
      }
      json.push(obj)
    })
    console.log(json)
    fs.writeFile('1.json', JSON.stringify(json), (err) => {
      if(err) console.error(err)
      else console.log('写入成功')
    })
  }
})