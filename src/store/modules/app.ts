import Cookies from 'js-cookie'
import { defineStore } from 'pinia';

const useAppStore = defineStore(
  'app',
  {
    state: () => ({
      sidebar: {
        opened: localStorage.getItem('sidebarStatus') ? !!localStorage.getItem('sidebarStatus') : true,
        withoutAnimation: false,
        hide: false
      },
      device: 'desktop',
      size: localStorage.getItem('size') || 'default'
    }),
    actions: {
      toggleSideBar(withoutAnimation: boolean) {
        if (this.sidebar.hide) {
          return false;
        }
        this.sidebar.opened = !this.sidebar.opened
        this.sidebar.withoutAnimation = withoutAnimation
        if (this.sidebar.opened) {
          localStorage.setItem('sidebarStatus', '1')
        } else {
          localStorage.setItem('sidebarStatus', '0')
        }
      },
      closeSideBar(withoutAnimation:boolean) {
        localStorage.setItem('sidebarStatus', '0')
        this.sidebar.opened = false
        this.sidebar.withoutAnimation = withoutAnimation
      },
      toggleDevice(device:string) {
        this.device = device
      },
      setSize(size:string) {
        this.size = size;
        localStorage.setItem('size', size)
      },
      toggleSideBarHide(status:boolean) {
        this.sidebar.hide = status
      }
    }
  })

export default useAppStore
