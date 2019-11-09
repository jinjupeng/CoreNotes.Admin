<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>系统管理</el-breadcrumb-item>
                <el-breadcrumb-item>菜单管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-row>
                <el-form :inline="true" :model="queryParam" class="query-form-inline">
                    <el-form-item>
                        <el-input v-model="queryParam.name" clearable placeholder="请输入菜单/按钮"></el-input>
                    </el-form-item>
                    <!-- 用户名的启用/禁用状态查询 -->
                    <el-form-item>
                        <el-button type="primary" @click="handleSearch">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleAdd">新增</el-button>
                    </el-form-item>
                </el-form>
            </el-row>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column type="selection" width="60" align="center"></el-table-column>
                <el-table-column label="菜单/按钮" width sortable>
                    <template slot-scope="scope">
                        <i class="fa" :class="scope.row.Icon"></i>
                        {{scope.row.Name}}
                    </template>
                </el-table-column>
                <el-table-column prop="PnameArr" label="父节点" width sortable align="center"></el-table-column>
                <el-table-column prop="Path" label="路由地址" width sortable align="center"></el-table-column>
                <el-table-column prop="moduleName" label="API接口" width sortable align="center"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="140" sortable align="center">
                    <template slot-scope="scope">{{scope.row.createTime | unixTime}}</template>
                </el-table-column>
                <el-table-column prop="enabled" label="状态" width="100" sortable align="center">
                    <template slot-scope="scope">
                        <el-tag
                            :type="scope.row.enabled  ? 'success' : 'danger'"
                            disable-transitions
                        >{{scope.row.enabled ? "正常":"禁用"}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="orderSort" label="排序" width="75" sortable></el-table-column>
                <el-table-column prop="isButton" label="是否按钮" width="120" sortable align="center">
                    <template slot-scope="scope">
                        <el-tag
                            :type="!scope.row.isButton  ? 'success' : 'danger'"
                            disable-transitions
                        >{{!scope.row.isButton ? "否":"是"}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="isHide" label="是否隐藏" width="120" sortable align="center">
                    <template slot-scope="scope">
                        <el-tag
                            :type="!scope.row.isHide  ? 'success' : 'danger'"
                            disable-transitions
                        >{{!scope.row.IsHide ? "否":"是"}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150" align="center">
                    <template scope="scope">
                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button
                            type="danger"
                            size="small"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
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
        </div>

        <!--编辑界面-->
        <el-dialog
            title="编辑"
            :visible.sync="editFormVisible"
            v-model="editFormVisible"
            :close-on-click-modal="false"
        >
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                <el-form-item label="菜单名称" prop="name">
                    <el-input v-model="editForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="路由地址" prop="path">
                    <el-tooltip
                        class="item"
                        effect="dark"
                        content="如果是导航条且无路由，请填‘-’字符，如果是按钮，请输入空格即可"
                        placement="top-start"
                    >
                        <el-input v-model="editForm.path" auto-complete="off"></el-input>
                    </el-tooltip>
                </el-form-item>
                <el-form-item label="描述" prop="description">
                    <el-input v-model="editForm.description" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="Icon" prop="icon">
                    <el-input v-model="editForm.icon" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="enabled">
                    <el-select v-model="editForm.enabled" placeholder="请选择状态">
                        <el-option
                            v-for="item in statusList"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="排序" prop="orderSort">
                    <el-input type="number" v-model="editForm.orderSort" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="IsButton" label="是否按钮" width sortable>
                    <el-switch v-model="editForm.isButton"></el-switch>
                </el-form-item>
                <el-form-item prop="IsHide" label="隐藏菜单" width sortable>
                    <el-switch v-model="editForm.isHide"></el-switch>
                </el-form-item>
                <el-form-item prop="PidArr" label="父级菜单" width sortable>
                    <el-cascader
                        placeholder="请选择，支持搜索功能"
                        style="width: 400px"
                        v-model="editForm.PidArr"
                        :options="options"
                        filterable
                        change-on-select
                    ></el-cascader>
                </el-form-item>
                <el-form-item prop="Mid" label="API接口" width sortable>
                    <el-select style="width: 100%;" v-model="editForm.moduleId" placeholder="请选择API">
                        <el-option :key="0" :value="0" :label="'无需api'"></el-option>
                        <el-option
                            v-for="item in modules"
                            :key="item.Id"
                            :value="item.Id"
                            :label="item.LinkUrl"
                        >
                            <span style="float: left">{{ item.LinkUrl }}</span>
                            <span
                                style="float: right; color: #8492a6; font-size: 13px"
                            >{{ item.Name }}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--新增界面-->
        <el-dialog
            title="新增"
            :visible.sync="addFormVisible"
            v-model="addFormVisible"
            :close-on-click-modal="false"
        >
            <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
                <el-form-item label="菜单名称" prop="Name">
                    <el-input v-model="addForm.Name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="路由地址" prop="Code">
                    <el-tooltip
                        class="item"
                        effect="dark"
                        content="如果是导航条且无路由，请填‘-’字符，如果是按钮，请输入空格即可"
                        placement="top-start"
                    >
                        <el-input v-model="addForm.Code" auto-complete="off"></el-input>
                    </el-tooltip>
                </el-form-item>
                <el-form-item label="描述" prop="Description">
                    <el-input v-model="addForm.Description" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="Enabled">
                    <el-select v-model="addForm.Enabled" placeholder="请选择状态">
                        <el-option
                            v-for="item in statusList"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="排序" prop="OrderSort">
                    <el-input v-model="addForm.OrderSort" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="IsButton" label="是否按钮" width sortable>
                    <el-switch v-model="addForm.IsButton"></el-switch>
                </el-form-item>
                <el-form-item prop="IsHide" label="隐藏菜单" width sortable>
                    <el-switch v-model="addForm.IsHide"></el-switch>
                </el-form-item>
                <el-form-item prop="PidArr" label="父级菜单" width sortable>
                    <el-cascader
                        style="width: 400px"
                        v-model="addForm.PidArr"
                        :options="options"
                        filterable
                        change-on-select
                    ></el-cascader>
                </el-form-item>

                <el-form-item prop="Mid" label="API接口" width sortable>
                    <el-select style="width: 100%;" v-model="addForm.Mid" placeholder="请选择API">
                        <el-option :key="0" :value="0" :label="'无需api'"></el-option>
                        <el-option
                            v-for="item in modules"
                            :key="item.Id"
                            :value="item.Id"
                            :label="item.LinkUrl"
                        >
                            <span style="float: left">{{ item.LinkUrl }}</span>
                            <span
                                style="float: right; color: #8492a6; font-size: 13px"
                            >{{ item.Name }}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getPermissionList, removePermission, editPermission, addPermission } from '../../../api/SystemManage/permission';
import util from '../../../utils/date';
import { utilsMixin } from '../../../mixin/utils';

export default {
    name: 'Permission',
    mixins: [utilsMixin],
    components: {},
    data() {
        return {
            tableData: [],
            statusList: [],
            users: [],
            modules: [], //接口api列表
            options: [],
            query: {
                pageIndex: 1,
                pageSize: 7
            },
            queryParam: { pageSize: 7 },
            pageTotal: 0,
            listLoading: false,
            editFormVisible: false, //编辑界面是否显示
            editLoading: false,
            editFormRules: {
                Name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
                Code: [{ required: true, message: '请输入路由地址', trigger: 'blur' }]
            },
            //编辑界面数据
            editForm: {
                Id: 0,
                Mid: 0,
                OrderSort: 0,
                PidArr: [],
                CreateBy: '',
                Name: '',
                Code: '',
                Description: '',
                Icon: '',
                Enabled: true,
                IsButton: false,
                IsHide: false
            },

            addFormVisible: false, //新增界面是否显示
            addLoading: false,
            addFormRules: {
                Name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
                Code: [{ required: true, message: '请输入路由地址', trigger: 'blur' }]
            },
            //新增界面数据
            addForm: {
                CreateBy: '',
                CreateId: '',
                PidArr: [],
                Mid: 0,
                OrderSort: 0,
                Name: '',
                Code: '',
                Description: '',
                Icon: '',
                Enabled: true,
                IsButton: false,
                IsHide: false
            }
        };
    },
    created() {
        this.fetchData();
    },
    methods: {
        fetchData() {
            this.listLoading = true;
            getPermissionList(this.query).then(res => {
                // console.log(res);
                this.tableData = res.response.data;
                this.pageTotal = res.response.dataCount;
                this.listLoading = false;
            });
        },
        // 触发搜索按钮
        handleSearch() {
            this.query = Object.assign(this.query, this.queryParam);
            this.fetchData();
        },
        //删除
        handleDelete(index, row) {
            this.$confirm('确认删除该记录吗?', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = { id: row.id };
                    removePermission(para).then(res => {
                        if (util.isEmt.format(res)) {
                            this.listLoading = false;
                            return;
                        }
                        this.listLoading = false;
                        //NProgress.done();
                        if (res.success) {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                        } else {
                            this.$message({
                                message: res.msg,
                                type: 'error'
                            });
                        }

                        this.fetchData();
                    });
                })
                .catch(() => {});
        },
        //显示编辑界面
        handleEdit(index, row) {
            this.editFormVisible = true;
            this.editForm = Object.assign({}, row);
            this.statusList = this.getEnumType('MenuStatus');
        },
        //显示新增界面
        handleAdd() {
            this.addFormVisible = true;
            this.addForm = {
                CreateBy: '',
                CreateId: '',
                PidArr: [],
                Name: '',
                Code: '',
                OrderSort: 0,
                Description: '',
                Enabled: true,
                Icon: '',
                IsButton: false,
                IsHide: false
            };
            this.statusList = this.getEnumType('MenuStatus');
        },
        //编辑
        editSubmit() {
            this.$refs.editForm.validate(valid => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        this.editLoading = true;
                        //NProgress.start();
                        let para = Object.assign({}, this.editForm);
                        editPermission(para).then(res => {
                            if (util.isEmt.format(res)) {
                                this.editLoading = false;
                                return;
                            }
                            if (res.success) {
                                this.editLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: res.msg,
                                    type: 'success'
                                });
                                this.$refs['editForm'].resetFields();
                                this.editFormVisible = false;
                                this.fetchData();
                            } else {
                                this.$message({
                                    message: res.msg,
                                    type: 'error'
                                });
                            }
                        });
                    });
                }
            });
        },
        //新增
        addSubmit() {
            this.$refs.addForm.validate(valid => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        this.addLoading = true;
                        //NProgress.start();
                        let para = Object.assign({}, this.addForm);
                        addPermission(para).then(res => {
                            if (util.isEmt.format(res)) {
                                this.addLoading = false;
                                return;
                            }

                            if (res.success) {
                                this.addLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: res.msg,
                                    type: 'success'
                                });
                                this.$refs['addForm'].resetFields();
                                this.addFormVisible = false;
                                this.fetchData();
                            } else {
                                this.$message({
                                    message: res.msg,
                                    type: 'error'
                                });
                            }
                        });
                    });
                }
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
