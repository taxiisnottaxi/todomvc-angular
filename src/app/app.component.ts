import { Component } from '@angular/core';

const todos = [
  {
    id: 1,
    title: '吃饭',
    done: true
  },
  {
    id: 2,
    title: '唱歌',
    done: false
  },
  {
    id: 3,
    title: '写代码',
    done: true
  }
]

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public todos: {
    id: number,
    title: string,
    done: boolean
  }[] = JSON.parse(window.localStorage.getItem('todos') || '[]')

  public visibility: string = 'all'

  public currentEditing: {
    id: number,
    title: string,
    done: boolean
  } = null

  // 该函数是一个特殊的 Angular 生命周期钩子函数
  // 它会在 Angular 应用初始化的时候执行一次
  ngOnInit () {
    this.hashchangeHandler()
    // 注意，这里要使用bind绑定this，否则this指向的是window
    window.onhashchange = this.hashchangeHandler.bind(this)
  }

  // 当 Angular 组件数据发生改变的时候，ngDoCheck 钩子函数会被触发
  // 我们需要做的就是在这个勾子函数中持久化存储我们的数据
  ngDoCheck () {
    window.localStorage.setItem('todos', JSON.stringify(this.todos))
  }

  get filterTodos () {
    if (this.visibility === 'all') {
      return this.todos
    } else if (this.visibility === 'active') {
      return this.todos.filter(t => !t.done)
    } else if (this.visibility === 'completed') {
      return this.todos.filter(t => t.done)
    }
  }

  // 实现导航模板切换数据过滤的功能
  // 1.提供一个属性，该属性会根据当前点击的链接返回过滤之后的数据
  //     fiterTodos
  // 2.提供属性，用来存储当前点击的链接标识
  //     visibility 字符串
  //     all、active、completed
  // 3.为链接添加点击事件，当点击导航链接的时候，改变
  // 

  addTodo (e): void {
    const titleText = e.target.value.trim()
    if (!titleText.length) {
      return
    }
    const lastId = this.todos.length !== 0 ? this.todos[this.todos.length - 1].id : 0
    this.todos.push({
      id: lastId ? lastId + 1 : 1,
      title: titleText,
      done: false
    })
    // 清除文本框
    e.target.value = ''
  }

  get toggleAll() {
    return this.todos.every(t => t.done)
  }

  set toggleAll(val) {
    this.todos.forEach(t => t.done = val)
  }

  removeTodo (index: number): void {
    this.todos.splice(index, 1)
  }

  saveEdit (todo, e) {
    // 保存编辑
    todo.title = e.target.value
    // 去除编辑样式
    this.currentEditing = null
  }

  handleEditKeyUp (e) {
    const {keyCode, target} = e
    if (keyCode === 27) {
      // 取消编辑
      // 同时把文本框的值恢复成原来的值
      target.value = this.currentEditing.title
      this.currentEditing = null
    }
  }

  get remaningCount () {
    return this.todos.filter(t => !t.done).length
  }

  hashchangeHandler () {
    // 当用户点击了锚点的时候，我们需要获取当前的锚点标识
    // 然后动态将跟组件中的visibility设置成当前点击的锚点标识
    const hash = window.location.hash.substr(1)
    switch (hash) {
      case '/':
        this.visibility = 'all'
        break;
      case '/active':
        this.visibility = 'active'
        break;
      case '/completed':
        this.visibility = 'completed'
        break;
      }
  }

  // 清楚所有已完成任务项
  clearAllDone () {
    this.todos = this.todos.filter(t => !t.done)
  }
}
