import sys
from PyQt5.QtWidgets import QApplication, QMainWindow, QVBoxLayout, QWidget, QPushButton, QLabel, QLineEdit, \
    QListWidget, QMessageBox, QInputDialog, QHBoxLayout, QRadioButton, QGroupBox

class OlympicsApp(QMainWindow):
    def __init__(self, n, m, w):
        super().__init__()

        self.n = n
        self.m = m
        self.w = w
        # Initialize the dictionaries first
        self.data = {}
        self.country_scores = {}
        self.country_male_scores = {}
        self.country_female_scores = {}
        self.sorted_data = []
        self.project_setup = {}

        # Now, populate the country scores dictionaries
        for i in range(1, n + 1):
            self.country_male_scores[i] = 0
            self.country_female_scores[i] = 0

        self.initUI()

    def initUI(self):
        self.setWindowTitle("奥运会成绩统计")
        self.setGeometry(100, 100, 800, 500)

        main_widget = QWidget(self)
        self.setCentralWidget(main_widget)
        layout = QVBoxLayout()

        score_input_layout = QHBoxLayout()
        self.input_label = QLabel("输入成绩 (格式: 国家编号 项目编号 名次):")
        self.input_line = QLineEdit()
        score_input_layout.addWidget(self.input_label)
        score_input_layout.addWidget(self.input_line)
        layout.addLayout(score_input_layout)

        self.enter_scores_btn = QPushButton("输入成绩")
        self.enter_scores_btn.clicked.connect(self.enter_scores)
        layout.addWidget(self.enter_scores_btn)

        self.setup_project_btn = QPushButton("设定项目前三/五名")
        self.setup_project_btn.clicked.connect(self.setup_project)
        layout.addWidget(self.setup_project_btn)

        self.calculate_scores_btn = QPushButton("统计各国总分")
        self.calculate_scores_btn.clicked.connect(self.calculate_scores)
        layout.addWidget(self.calculate_scores_btn)

        self.sort_btn = QPushButton("按总分排序输出")
        self.sort_btn.clicked.connect(self.sort_countries)
        layout.addWidget(self.sort_btn)

        self.sort_by_id_btn = QPushButton("按国家编号排序输出")
        self.sort_by_id_btn.clicked.connect(self.sort_countries_by_id)
        layout.addWidget(self.sort_by_id_btn)

        self.sort_male_btn = QPushButton("按男子团体总分排序输出")
        self.sort_male_btn.clicked.connect(self.sort_countries_by_male_scores)
        layout.addWidget(self.sort_male_btn)

        self.sort_female_btn = QPushButton("按女子团体总分排序输出")
        self.sort_female_btn.clicked.connect(self.sort_countries_by_female_scores)
        layout.addWidget(self.sort_female_btn)

        self.query_btn = QPushButton("查询国家项目情况")
        self.query_btn.clicked.connect(self.query_country)
        layout.addWidget(self.query_btn)

        self.query_project_btn = QPushButton("查询项目前三/五名国家")
        self.query_project_btn.clicked.connect(self.query_project)
        layout.addWidget(self.query_project_btn)

        self.result_label = QLabel()
        layout.addWidget(self.result_label)

        self.list_widget = QListWidget()
        layout.addWidget(self.list_widget)

        main_widget.setLayout(layout)

        self.data = {}
        self.country_scores = {}
        self.country_male_scores = {}
        self.country_female_scores = {}
        self.sorted_data = []
        self.project_setup = {}

    def enter_scores(self):
        input_text = self.input_line.text()
        parts = input_text.split()

        if len(parts) != 3:
            QMessageBox.warning(self, "输入错误", "请输入正确的格式：国家编号 项目编号 名次")
            return

        country_id, project_id, rank = map(int, parts)

        if country_id < 1 or country_id > self.n or project_id < 1 or (project_id > self.m + self.w):
            QMessageBox.warning(self, "输入错误", "国家编号或项目编号不在有效范围内")
            return

        max_scores = self.project_setup.get(project_id, 5)
        if rank < 1 or rank > max_scores:
            QMessageBox.warning(self, "输入错误", f"名次不在有效范围内 (1-{max_scores})")
            return

        # 根据项目编号和名次计算积分
        if max_scores == 3:
            points_map = {1: 5, 2: 3, 3: 2}
        else:
            points_map = {1: 7, 2: 5, 3: 3, 4: 2, 5: 1}
        score = points_map[rank]

        if country_id not in self.data:
            self.data[country_id] = {}

        if project_id not in self.data[country_id]:
            self.data[country_id][project_id] = []

        self.data[country_id][project_id].append((rank, score))

        # 判断男子或女子项目并记录得分
        if project_id <= self.m:  # 男子项目
            self.country_male_scores[country_id] = self.country_male_scores.get(country_id, 0) + score
        else:  # 女子项目
            self.country_female_scores[country_id] = self.country_female_scores.get(country_id, 0) + score

        self.input_line.clear()
        self.result_label.setText("成绩已录入")

    def setup_project(self):
        project_id, ok = QInputDialog.getInt(self, '设定项目', '请输入项目编号:', 1, 1, self.m + self.w)
        if not ok:
            return

        group_box = QGroupBox("选择计分规则")
        group_layout = QVBoxLayout()
        three_point_rb = QRadioButton("前三名 (5, 3, 2)")
        five_point_rb = QRadioButton("前五名 (7, 5, 3, 2, 1)")
        three_point_rb.setChecked(True)
        group_layout.addWidget(three_point_rb)
        group_layout.addWidget(five_point_rb)
        group_box.setLayout(group_layout)

        result = QMessageBox(self)
        result.setWindowTitle("设定项目")
        result.setText(f"您正在为项目编号 {project_id} 设定计分规则.")
        result.setIcon(QMessageBox.Information)
        result.layout().addWidget(group_box, 1, 0, 1, result.layout().columnCount())
        result.addButton(QMessageBox.Ok)
        result.addButton(QMessageBox.Cancel)

        if result.exec_() == QMessageBox.Ok:
            self.project_setup[project_id] = 5 if five_point_rb.isChecked() else 3

    def calculate_scores(self):
        self.sorted_data = []
        self.country_scores = {}

        for country_id, projects in self.data.items():
            total_score = 0
            for project_id, project_scores in projects.items():
                max_scores = self.project_setup.get(project_id, 5)
                project_scores.sort()
                total_score += sum(score for _, score in project_scores[:max_scores])
            self.country_scores[country_id] = total_score

        self.sorted_data = list(self.country_scores.items())
        self.sorted_data.sort(key=lambda x: x[1], reverse=True)
        self.result_label.setText("总分已计算")

    def sort_countries(self):
        self.list_widget.clear()
        for country_id, total_score in self.sorted_data:
            self.list_widget.addItem(f"国家编号: {country_id}, 总分: {total_score}")

    def sort_countries_by_id(self):
        self.list_widget.clear()
        for country_id in sorted(self.data.keys()):
            self.list_widget.addItem(f"国家编号: {country_id}, 总分: {self.country_scores.get(country_id, 0)}")

    def sort_countries_by_male_scores(self):
        sorted_male_scores = sorted(self.country_male_scores.items(), key=lambda x: x[1], reverse=True)
        self.list_widget.clear()
        for country_id, male_score in sorted_male_scores:
            self.list_widget.addItem(f"国家编号: {country_id}, 男子团体总分: {male_score}")

    def sort_countries_by_female_scores(self):
        sorted_female_scores = sorted(self.country_female_scores.items(), key=lambda x: x[1], reverse=True)
        self.list_widget.clear()
        for country_id, female_score in sorted_female_scores:
            self.list_widget.addItem(f"国家编号: {country_id}, 女子团体总分: {female_score}")

    def query_country(self):
        input_text = self.input_line.text()
        try:
            country_id = int(input_text)
            if country_id in self.data:
                self.list_widget.clear()
                for project_id, project_scores in self.data[country_id].items():
                    max_scores = self.project_setup.get(project_id, 5)
                    project_scores.sort()
                    self.list_widget.addItem(
                        f"国家编号: {country_id}, 项目编号: {project_id}, 前{max_scores}名成绩: {project_scores[:max_scores]}")
            else:
                QMessageBox.warning(self, "查询失败", "该国家编号不存在")
        except ValueError:
            QMessageBox.warning(self, "查询失败", "请输入有效的国家编号")

    def query_project(self):
        input_text = self.input_line.text()
        try:
            project_id = int(input_text)
            max_scores = self.project_setup.get(project_id, 5)
            top_countries = []
            for country_id, projects in self.data.items():
                if project_id in projects:
                    top_countries.extend([(country_id, score) for _, score in projects[project_id]])
            top_countries.sort(key=lambda x: x[1], reverse=True)
            self.list_widget.clear()
            for country_id, _ in top_countries[:max_scores]:
                self.list_widget.addItem(f"项目编号: {project_id}, 国家编号: {country_id}")
        except ValueError:
            QMessageBox.warning(self, "查询失败", "请输入有效的项目编号")


if __name__ == "__main__":
    app = QApplication(sys.argv)

    # Prompt for n
    n, ok = QInputDialog.getInt(None, '输入国家数量', '请输入参加奥运会的国家数量(n):', 1, 1, 100)
    if not ok:
        QMessageBox.critical(None, "错误", "您没有输入国家数量!")
        sys.exit()

    # Prompt for m
    m, ok = QInputDialog.getInt(None, '输入男子项目数量', '请输入男子项目数量(m):', 1, 1, 100)
    if not ok:
        QMessageBox.critical(None, "错误", "您没有输入男子项目数量!")
        sys.exit()

    # Prompt for w
    w, ok = QInputDialog.getInt(None, '输入女子项目数量', '请输入女子项目数量(w):', 1, 1, 100)
    if not ok:
        QMessageBox.critical(None, "错误", "您没有输入女子项目数量!")
        sys.exit()

    window = OlympicsApp(n, m, w)
    window.show()
    sys.exit(app.exec_())
