const registerCanvas = (tag, {mobilePoints, desktopPoints, scrollStart, scrollEnd}, colorLine) => {
    const canvasWrapper = document.querySelector(tag)
    const img = canvasWrapper.querySelector('img')

    const getCurrentCanvas = () => canvasWrapper.querySelector('canvas')
    const getMode = () => window.innerWidth > window.innerHeight ? 'desktop' : 'mobile'
    const applySigmoidFunction = (x, slope) => {
      return 1 / (1 + Math.exp(-2 * slope * x + slope))
      // return 1 / (1 + Math.exp(-2 * slope * x + slope))
    }
  
    const interpolate = (start, end, x) => {
      // Pode mudar os valores pra slope pra tu ver como fica melhor
      // Menos de 5 não recomendo
      const interpoX = applySigmoidFunction(x, 5) //5 //1
      const interpoY = applySigmoidFunction(x, 8) //8  //2
      return [
        start[0] * (1 - interpoX) + end[0] * interpoX,
        start[1] * (1 - interpoY) + end[1] * interpoY
      ]
    }
  
    let prevScroll = 0
    let prevPoint = undefined
    let prevMode = undefined
  
    new MutationObserver(() => {
      const prev = getCurrentCanvas()
      const mode = getMode()
      const sameMode = !prevMode || prevMode === mode
  
      const canvas = document.createElement('canvas')
      canvas.style.position = 'absolute'
      const rect = img.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
      canvas.style.top = '50%'
      canvas.style.left = '50%'
      canvas.style.transform = 'translate(-50%, -50%)'
  
      if (prev && sameMode) {
        canvas.getContext('2d').drawImage(prev, 0, 0, canvas.width, canvas.height)
        canvasWrapper.removeChild(prev)
      } else if (!sameMode) {
        window.scrollTo(window.scrollX, scrollStart)
      }
  
      canvasWrapper.appendChild(canvas)
      prevMode = mode
    }).observe(img,  { attributes : true, attributeFilter : ['style'] })
  
    const scroll = (scrollY) => {
      const canvas = getCurrentCanvas()
      const points = getMode() === 'desktop' ? desktopPoints : mobilePoints
  
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      const pointsLength = points.length - 1
  
      const scrollPercent = (scrollY - scrollStart) / (scrollEnd - scrollStart)
      if (scrollPercent < -1)
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    
        if (scrollPercent < 0)
        return
        if (scrollPercent >= 1)
        return
  
      const item = Math.floor(scrollPercent * pointsLength)
      const currPercent = points[item]
      const nextPercent = points[item + 1]
  
      const curr = [currPercent[0] * canvas.width / 100, currPercent[1] * canvas.height / 100]
      const next = [nextPercent[0] * canvas.width / 100, nextPercent[1] * canvas.height / 100]
  
      const localPercent = (scrollPercent - item / pointsLength) * pointsLength
  
      // Também pode mudar a cor,a primeira é a de desenho, a segunda é pra apagar
      ctx.globalCompositeOperation = scrollPercent > prevScroll ? 'source-over' : 'destination-out';
      ctx.strokeStyle = scrollPercent > prevScroll ? colorLine : 'black'
      ctx.lineWidth = 5
  
      ctx.beginPath()
      if (prevPoint)
        ctx.moveTo(prevPoint[0], prevPoint[1])
  
      const nextPoint = interpolate(curr, next, localPercent)
      ctx.lineTo(nextPoint[0], nextPoint[1])
      ctx.stroke()
      ctx.closePath()
  
      prevScroll = scrollPercent
      prevPoint = nextPoint
    }
  
    let prevScrollY = 0
    window.addEventListener('scroll', (e) => {
      const maxScroll = 10
      const iterations = Math.ceil(window.scrollY / maxScroll)
      for (let i = 0; i < iterations; i++) {
        scroll(prevScrollY + (window.scrollY - prevScrollY) * (i / iterations))
      }
      prevScrollY = window.scrollY
    })
  }
  
  registerCanvas('.b ', {
    // Coloque pontos dentro de um canvas, em porcentagens
    //mobilePoints: [[-10, 80], [30, 60],[100, 10]],
    mobilePoints: [[0, 0], [0, 0],[0, 0]],
    // Coloque pontos dentro de um canvas, em porcentagens
   // desktopPoints: [[0, 70],[25, 40], [50, 34],[54, 25],[53, 20],[52, 18],[50, 16],[48, 25],[50, 30],[52, 30],[54, 25],[53, 20],[52, 18],[50, 16],[50, 0],[60, 5],[70, 20],[75, 25],[74, 26],[74, 27],[72, 40],[65, 50],[60, 60],[60, 63],[63, 70],[100, 80],],
    //Forca versao
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++54 volta///////////////////////////////////


//desktopPoints: [[51, 25],[45, 30],[55, 15],[40, 20],[60, 35],[50, 5],[50, 50],[70, 4],[35, 70],[20, 0],[90, 34],[45, 34],[50, 34],[40, 20],[60, 35],[50, 5][70, 4],[35, 70],[50, 50],[70, 4],[51, 25],[45, 30],[55, 15],[40, 20],],
//-------------------------------------------------------------------------------------------------------------------------------*


    //desktopPoints: [[73, 0], [76, 10], [78, 20], [79, 30], [78, 40],[77, 50],[70, 50],[69, 50],[79, 0],[58, 50],[62, 0],[65, 0],[70, 0],],

    //  desktopPoints: [[0, 0], [15, 15], [6, 20], [45, 30], [90, 60]],
    // Quando o efeito começa, em pixels da barra de scroll
    scrollStart: 1600,
    // Quando o evento termina, em pixels da barra de scroll
    scrollEnd: 2500,
  },'red')

  registerCanvas('.b ', {
   
    mobilePoints: [[-10, 20], [100, 100]],
    


    desktopPoints: [[20, -20],[100, 90],],
    //desktopPoints: [[0, 0],[10, 100],],

    scrollStart: 1600,
  
    scrollEnd: 2500,
  },'red')


  registerCanvas('.b ', {
   
    mobilePoints: [[-10, 50], [100, 70]],
    //[horizontal, vertical][horizobtal, vertical]
    


    desktopPoints: [[70, -20],[20, 90],],
    // desktopPoints: [[100, 0],[80, 100],],
//1 --> 2
//       |
//       7


    scrollStart: 1600,
  
    scrollEnd: 2500,
  },'red')

  registerCanvas('.b ', {
   
    mobilePoints: [[0, 0], [0, 0]],
    //mobilePoints: [[0, 0], [15, 15], [6, 20], [45, 30], [90, 60]],
    


    desktopPoints: [[100, -20],[80, 100],],
    // desktopPoints: [[100, 0],[80, 100],],
    //[horizontal, vertical][horizobtal, vertical]
//1 --> 2
//       |
//       7


    scrollStart: 1600,
  
    scrollEnd: 2500,
  },'#e002026b')

  registerCanvas('.b ', {
   
    //mobilePoints: [[0, -200], [15, 100],],
    mobilePoints: [[0, 0], [0, 0]],


    mobilePoints: [ [, 57], [84, 46],, ],
    


    desktopPoints: [[0, -20],[20, 100],],
    // desktopPoints: [[100, 0],[80, 100],],
    //[horizontal, vertical][horizobtal, vertical]
//1 --> 2
//       |
//       7


    scrollStart: 1600,
  
    scrollEnd: 2500,
  }, '#e002026b')