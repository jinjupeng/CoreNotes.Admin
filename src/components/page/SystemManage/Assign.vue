<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>系统管理</el-breadcrumb-item>
                <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-row>
                <el-form :inline="true" :model="queryParam" class="query-form-inline">
                    <el-form-item>
                        <el-input v-model="queryParam.name" clearable placeholder="请输入角色名"></el-input>
                    </el-form-item>
                    <!-- 用户名的启用/禁用状态查询 -->
                    <el-form-item>
                        <el-button type="primary" @click="handleSearch">查询</el-button>
                    </el-form-item>
                </el-form>
            </el-row>
            <el-row :gutter="15">
                <!--角色管理-->
                <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17" style="margin-bottom: 10px">
                    <el-card class="box-card" shadow="never">
                        <div slot="header" class="clearfix">
                            <span class="role-span">角色列表</span>
                        </div>
                        <el-table :data="roles" border @current-change="handleCurrentChange" v-loading="listLoading">
                            <el-table-column prop="roleName" label="角色名"></el-table-column>
                            <el-table-column prop="description" label="说明"></el-table-column>
                            <el-table-column prop="createTime" label="创建时间">
                                <template slot-scope="scope">{{ scope.row.createTime }}</template>
                            </el-table-column>
                            <el-table-column prop="enabled" label="状态" align="center">
                                <template slot-scope="scope">
                                    <el-tag
                                        :type="scope.row.enabled ? 'success' : 'danger'"
                                        disable-transitions
                                    >{{scope.row.enabled ? "正常":"禁用"}}</el-tag>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="pagination">
                            <el-pagination
                                layout="sizes, total, prev, pager, next"
                                :page-sizes="[8, 20, 30, 100]"
                                :page-size.sync="query.pageSize"
                                :current-page.sync="query.pageIndex"
                                @current-change="(val) => { fetchData() }"
                                @size-change="(val) => { fetchData() }"
                                :total="pageTotal"
                            ></el-pagination>
                        </div>
                    </el-card>
                </el-col>
                <!-- 授权 -->
                <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="7">
                    <el-card class="box-card" shadow="never">
                        <div slot="header" class="clearfix">
                            <el-tooltip
                                class="item"
                                effect="dark"
                                content="选择指定角色分配菜单"
                                placement="top"
                            >
                                <span class="role-span">菜单分配</span>
                            </el-tooltip>
                            <el-button
                                :disabled="!showButton"
                                :loading="menuLoading"
                                icon="el-icon-check"
                                size="mini"
                                style="float: right; padding: 6px 9px"
                                type="primary"
                                @click="saveMenu"
                            >保存</el-button>
                        </div>
                        <el-tree
                            ref="menu"
                            :data="menus"
                            :default-checked-keys="menuIds"
                            :props="defaultProps"
                            accordion
                            show-checkbox
                            node-key="id"
                        />
                    </el-card>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import { getMenuTree, getMenuTreeList } from '../../../api/SystemManage/menu';
import { getRoleList } from '../../../api/SystemManage/role';
import { saveAssign, showPermission } from '../../../api/SystemManage/assign';
import util from '../../../utils/date';
import { utilsMixin } from '../../../mixin/utils';

export default {
    name: 'ModulePermission',
    mixins: [utilsMixin],
    components: {},
    data() {
        return {
            roles: [], // 角色列表
            menus: [], // 菜单树
            menuIds: [],
            nodekey: [],
            currentRoleId: 0,
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            query: {
                pageIndex: 1,
                pageSize: 7,
                enabled: true
            },
            queryParam: { pageSize: 7, name: '' },
            pageTotal: 0,
            listLoading: false,
            menuLoading: false,
            showButton: false
        };
    },
    created() {
        this.fetchData();
    },
    methods: {
        fetchData() {
            this.listLoading = true;
            // 获取角色列表
            getRoleList(this.query).then(res => {
                this.roles = res.response.data;
                this.pageTotal = res.response.dataCount;
                this.listLoading = false;
            });
            // 获取菜单树
            getMenuTreeList().then(res => {
                this.menus = res.response;
            });
            this.menuIds = [];
        },
        // TODO：查询待完善
        handleSearch() {
            // this.query = Object.assign(this.query, this.queryParam);
            this.fetchData();
        },
        // 获取菜单树
        getMenuTree() {
            getMenuTree().then(res => {
                if (res.success) {
                    this.options = res.response;
                }
            });
        },
        handleCurrentChange(val) {
            if (val) {
                // 清空菜单的选中
                // this.$refs.menu.setCheckedKeys([]);

                // 保存当前的角色id
                this.currentRoleId = val.id;
                this.showPermission(this.currentRoleId);
                // 点击后显示按钮
                this.showButton = true;
                // 初始化
                this.menuIds = [];
            }
        },
        // 显示角色已分配的权限
        showPermission(roleId) {
            showPermission(roleId).then(res => {
                if (res.success) {
                    this.menuIds = res.response;
                }
            });
        },

        // 保存角色分配的权限
        saveMenu() {
            this.nodekey = this.$refs.menu.getCheckedKeys();
            var param = { roleId: 0, array: '' };
            (param.roleId = this.currentRoleId), (param.array = this.nodekey.join(','));
            if (!this.nodekey.length > 0) {
                this.$message({
                    message: '所选节点为空',
                    type: 'error'
                });
                return;
            }

            this.$confirm('确认提交吗？', '提示', {}).then(() => {
                this.addLoading = true;
                this.menuLoading = true;
                saveAssign(param).then(res => {
                    if (util.isEmt.format(res)) {
                        this.listLoading = false;
                        this.menuLoading = false;
                        return;
                    }

                    if (res.success) {
                        this.listLoading = false;
                        this.menuLoading = false;
                        this.$message({
                            message: res.msg,
                            type: 'success'
                        });
                        this.listLoading = false;
                        this.menuLoading = false;
                        this.fetchData();
                        this.menuIds = [];
                    } else {
                        this.$message({
                            message: res.msg,
                            type: 'error'
                        });
                    }
                });
            });
        }
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
