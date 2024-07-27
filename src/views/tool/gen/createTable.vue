<template>
  <!-- 创建表 -->
  <el-dialog title="创建表" v-model="visible" width="800px" top="5vh" append-to-body>
    <span>创建表语句(支持多个建表语句)：</span>
    <el-input type="textarea" :rows="18" placeholder="请输入文本" v-model="content"></el-input>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleCreateTable">确 定</el-button>
      <el-button @click="visible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script setup>
import { createTable } from "@/api/tool/gen";
import { modal } from "@/plugins/index";
const emit = defineEmits(["ok"]);
// 遮罩层
const visible = ref(false);
// 文本内容
const content = ref(`
create table table_name
(
  id        bigint(20)      not null auto_increment    comment '主键',
  create_by        varchar(64)     default ''                 comment '创建者',
  create_time      datetime                                   comment '创建时间',
  update_by        varchar(64)     default ''                 comment '更新者',
  update_time      datetime                                   comment '更新时间',
  remark           varchar(500)    default null               comment '备注',
  primary key (id)
) engine=innodb auto_increment=100 comment = '数据表名称';
`);

/** 创建按钮操作 */
function handleCreateTable() {
  if (content.value === "") {
    modal.msgError("请输入建表语句");
    return;
  }
  createTable({ sql: content.value }).then(res => {
    modal.msgSuccess(res.msg);
    if (res.code === 200) {
      visible.value = false;
      emit("ok");
    }
  });
}

// 显示弹框
function show() {
  visible.value = true;
}
defineExpose({
  show,
});
</script>