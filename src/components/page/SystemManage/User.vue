<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>系统管理</el-breadcrumb-item>
                <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-row>
                <el-form :inline="true" :model="queryParam" class="query-form-inline">
                    <el-form-item>
                        <el-input v-model="queryParam.name" clearable placeholder="请输入登录名"></el-input>
                    </el-form-item>
                    <!-- 用户名的启用/禁用状态查询 -->
                    <el-form-item>
                        <el-button type="primary" @click="handleSearch">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleAdd">新增</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button
                            type="primary"
                            icon="el-icon-delete"
                            class="handle-del mr10"
                            @click="batchRemove"
                        >批量删除</el-button>
                    </el-form-item>
                </el-form>
            </el-row>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="realName" label="昵称"></el-table-column>
                <el-table-column prop="loginName" label="登录名"></el-table-column>
                <el-table-column prop="roleName" label="角色"></el-table-column>
                <el-table-column prop="sex" label="性别" align="center">
                    <template slot-scope="scope">
                        <el-tag>{{ scope.row.sex | enumDesc('SexValues') }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="birthDay" label="生日">
                    <template slot-scope="scope">{{ scope.row.birthDay }}</template>
                </el-table-column>
                <el-table-column prop="status" label="状态" align="center">
                    <template slot-scope="scope">
                        <el-tag
                            :type="scope.row.status == 1  ? 'success' : 'danger'"
                            disable-transitions
                        >{{scope.row.status == 1 ? "正常":"禁用"}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <!-- 用户名的启用/禁用按钮 -->
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
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
                <el-form-item label="昵称" prop="realName">
                    <el-input v-model="editForm.realName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="登录名" prop="loginName">
                    <el-input v-model="editForm.loginName" auto-complete="off"></el-input>
                </el-form-item>
                <!-- 密码由登录用户单独修改，不在这里修改 -->
                <!--<el-form-item label="密码" prop="pwd"">-->
                <!--<el-input v-model="editForm.pwd" show-password  auto-complete="off"></el-input>-->
                <!--</el-form-item>-->

                <el-form-item label="角色" prop="roleId">
                    <el-select v-model="editForm.roleId" placeholder="请选择角色">
                        <el-option :key="0" :label="'未选择角色'" :value="0"></el-option>
                        <el-option
                            v-for="item in roles"
                            :key="item.Id"
                            :label="item.Name"
                            :value="item.Id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio-group v-model="editForm.sex">
                        <el-radio class="radio" :label="1">男</el-radio>
                        <el-radio class="radio" :label="0">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="年龄">
                    <el-input-number v-model="editForm.age" :min="0" :max="200"></el-input-number>
                </el-form-item>
                <el-form-item label="生日">
                    <el-date-picker type="date" placeholder="选择日期" v-model="editForm.birthDay"></el-date-picker>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input type="textarea" v-model="editForm.address"></el-input>
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
                <el-form-item label="昵称" prop="RealName">
                    <el-input v-model="addForm.realName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="登录名" prop="LoginName">
                    <el-input v-model="addForm.loginName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="Pwd">
                    <el-input v-model="addForm.pwd" show-password auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio-group v-model="addForm.sex">
                        <el-radio class="radio" :label="1">男</el-radio>
                        <el-radio class="radio" :label="0">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="年龄">
                    <el-input-number v-model="addForm.age" :min="0" :max="200"></el-input-number>
                </el-form-item>
                <el-form-item label="生日">
                    <el-date-picker type="date" placeholder="选择日期" v-model="addForm.birthDay"></el-date-picker>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input type="textarea" v-model="addForm.address"></el-input>
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
import { getUserList, removeUser, batchRemoveUser, editUser, addUser } from '../../../api/SystemManage/user';
import { getRoleList } from '../../../api/SystemManage/role';
import util from '../../../utils/date';
import { utilsMixin } from '../../../mixin/utils';

export default {
    name: 'User',
    mixins: [utilsMixin],
    components: {},
    data() {
        return {
            tableData: [],
            roles: [], // 角色数据
            multipleSelection: [], // 选中列
            query: {
                pageIndex: 1,
                pageSize: 7
            },
            queryParam: { pageSize: 7, name: '', status: '' },
            pageTotal: 0,
            delList: [],
            listLoading: false,
            editFormVisible: false, //编辑界面是否显示
            editLoading: false,
            editFormRules: {
                loginName: [{ required: true, message: '请输入登录名', trigger: 'blur' }],
                realName: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
                birthDay: [{ required: true, message: '请填写生日', trigger: 'blur' }]
            },
            //编辑界面数据
            editForm: {
                id: 0,
                roleId: 0,
                loginName: '',
                realName: '',
                sex: -1,
                age: 0,
                birthDay: '',
                address: ''
            },

            addFormVisible: false, //新增界面是否显示
            addLoading: false,
            addFormRules: {
                loginName: [{ required: true, message: '请输入登录名', trigger: 'blur' }],
                realName: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
                pwd: [{ required: true, message: '请输入密码', trigger: 'blur' }],
                birthDay: [{ required: true, message: '请填写生日', trigger: 'blur' }]
            },
            //新增界面数据
            addForm: {
                loginName: '',
                realName: '',
                pwd: '',
                sex: -1,
                age: 0,
                birthDay: '',
                address: ''
            }
        };
    },
    created() {
        this.fetchData();
    },
    methods: {
        fetchData() {
            this.listLoading = true;
            getUserList(this.query).then(res => {
                // console.log(res);
                this.tableData = res.response.data;
                this.pageTotal = res.response.dataCount;
                this.listLoading = false;
            });
        },
        //性别显示转换
        formatSex(row, column) {
            return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
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
                    removeUser(para).then(res => {
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
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        //显示编辑界面
        handleEdit(index, row) {
            this.editFormVisible = true;
            this.editForm = Object.assign({}, row);

            getRoleList().then(res => {
                this.roles = res.response.data;
            });
        },
        //显示新增界面
        handleAdd() {
            this.addFormVisible = true;
            this.addForm = {
                loginName: '',
                realName: '',
                pwd: '',
                sex: -1,
                age: 0,
                birthDay: '',
                address: ''
            };
        },
        //编辑
        editSubmit() {
            this.$refs.editForm.validate(valid => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        this.editLoading = true;
                        //NProgress.start();
                        let para = Object.assign({}, this.editForm);

                        para.birth =
                            !para.birth || para.birth == ''
                                ? util.formatDate.format(new Date(), 'yyyy-MM-dd')
                                : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');

                        editUser(para).then(res => {
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
                        para.birth =
                            !para.birth || para.birth == ''
                                ? util.formatDate.format(new Date(), 'yyyy-MM-dd')
                                : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
                        addUser(para).then(res => {
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
        },
        //批量删除
        batchRemove() {
            var ids = this.multipleSelection.map(item => item.id).toString();
            this.$confirm('确认删除选中记录吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = { ids: ids };

                    batchRemoveUser(para).then(res => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '该功能未开放',
                            type: 'warning'
                        });
                        console.log(res);
                    });
                })
                .catch(() => {});
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
