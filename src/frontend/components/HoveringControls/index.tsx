import React, { FunctionComponent, useState } from 'react'
import {MenuOutlined} from '@ant-design/icons'
import classNames from './style'
import {Drawer} from 'antd'


export const HoveringControls = () => {
  const [visible, setVisible] = useState(false)
  return (
    <div className={classNames.hoveringControls}>
      <MenuOutlined className={classNames.icon} style={{color: '#fff'}} onClick={() => setVisible(true)}/>

      <Drawer
          title="Basic Drawer"
          placement="left"
          closable={false}
          onClose={() => setVisible(false)}
          visible={visible}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Drawer>
    </div>
  )
}




{/* <template lang="html">
<div class="hovering-controls">
   <v-icon large @click="drawer = !drawer" color="#fff" class="icon">
     mdi-menu
   </v-icon>
   <v-navigation-drawer
   absolute
   v-model="drawer"
   floating
   temporary
   >
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="title">
          {{ $vuetify.lang.t('$vuetify.remotifyYourPlace') }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>

    <v-list
      dense
      nav
    >
      <v-list-item
        v-for="item in items"
        :key="item.title"
        link
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
 </div>
</template>

<script>
export default {
  data () {
    return {
      drawer: false,
      items: [
        { title: 'Dashboard', icon: 'mdi-view-dashboard' },
        { title: 'Photos', icon: 'mdi-image' },
        { title: 'About', icon: 'mdi-help-box' },
      ],
      right: null,
    }
  },
}
</script>

<style lang="scss" scoped>

</style> */}