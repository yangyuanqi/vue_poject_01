<template>
  <div>
    <!--表格-->
    <el-table :data="adminList" style="width: 100%" border stripe>
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column prop="id" label="ID" width="180"></el-table-column>
      <el-table-column prop="username" label="用户名" width="180"></el-table-column>
      <el-table-column prop="nickname" label="昵称"></el-table-column>
      <el-table-column prop="nickname" label="所属组别"></el-table-column>
      <el-table-column prop="email" label="Email"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" @change="adminStateChange(scope.row)" active-value="normal"
                     inactive-value="hidden"></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="logintime" label="最后登录" :formatter="dateFormat"></el-table-column>
      <el-table-column label="操作" width="180px">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showEditDialog(scope.row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="del(scope.row)"
          ></el-button>
          <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.page"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>
