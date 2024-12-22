const categoryVisibility = {};

export function loadFood() {
    // 清空並顯示食材邏輯
    //console.log('Loading food...');
    const displayDiv = document.getElementById('ingredient-table');
    const warningDiv = document.querySelector('.warning');
    displayDiv.innerHTML = ''; // 清空旧内容
    warningDiv.innerHTML = ''; // 清空警告信息

    // 用来分类食材的容器
    const categories = {
        '豆類/蛋/肉': [],
        '蔬果': [],
        '冷凍': []
    };

    // 从 Local Storage 获取数据并按类别分类
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('food-')) {
            const food = JSON.parse(localStorage.getItem(key));
            categories[food.category].push(food); // 根据分类将食材加入相应的类别数组
        }
    }

    // 统计即将过期的食材数量
    const expiryWarning = {
        '豆類/蛋/肉': 0,
        '蔬果': 0,
        '冷凍': 0
    };

    const currentDate = new Date();

    // 创建分类区域
    Object.keys(categories).forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.classList.add('category-section');
        
        const categoryHeader = document.createElement('h3');
        categoryHeader.textContent = category;
        categoryDiv.appendChild(categoryHeader);
        
        const table = document.createElement('table');
        const isVisible = categoryVisibility[category] || false; // 默认折叠
        table.style.display = isVisible ? 'table' : 'none'; // 根据状态设置显示状态

        const headerRow = document.createElement('tr');
        headerRow.innerHTML = `
            <th>名稱</th>
            <th>數量</th>
            <th>有效期限</th>
            <th>分類</th>
            <th></th>
        `;
        table.appendChild(headerRow);
        
        // 将该分类下的食材渲染到表格中
        categories[category].forEach(food => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${food.name}</td>
                <td>${food.quantity}</td>
                <td>${food.expiry}</td>
                <td>${food.category}</td>
            `;
            // 检查是否即将过期
            const foodExpiry = new Date(food.expiry);
            const timeDiff = foodExpiry - currentDate;
            const daysUntilExpiry = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // 转换为天数

            if (daysUntilExpiry > 0 && daysUntilExpiry <= 7) {
                row.classList.add('warning-row'); // 给即将过期的食材添加警告样式
                expiryWarning[category]++; // 增加对应分类的过期提醒计数
            }

            // 添加删除按钮
            const actionCell = document.createElement('td');
            const deleteButton = document.createElement('button');
            deleteButton.textContent = '刪除';
            const foodKey = `food-${food.name}`; // 确保使用正确的键名
            deleteButton.onclick = () => deleteIngredient(foodKey);

            actionCell.appendChild(deleteButton);
            row.appendChild(actionCell);
            table.appendChild(row);
        });

        categoryDiv.appendChild(table);
        displayDiv.appendChild(categoryDiv);

        // 添加点击事件以切换显示/隐藏
        categoryHeader.addEventListener('click', () => {
            const currentState = table.style.display === 'none';
            table.style.display = currentState ? 'table' : 'none'; // 切换状态
            categoryVisibility[category] = currentState; // 更新状态记录
        });
    });

    // 显示过期提醒
    Object.keys(expiryWarning).forEach(category => {
        if (expiryWarning[category] > 0) {
            const warningMessage = document.createElement('p');
            warningMessage.textContent = `${category} 分類中有 ${expiryWarning[category]} 個食材即將過期！`;
            warningDiv.appendChild(warningMessage);
        }
    });
}

export function addIngredient() {
    const name = document.getElementById("name").value.trim();
    const quantity = document.getElementById("quantity").value.trim();
    const expiry = document.getElementById("expiry").value.trim();
    const category = document.getElementById("category").value;
    const popupBox = document.getElementById('popupBox');

    if (name && quantity && expiry) {
        const key = `food-${name}`;
        if (localStorage.getItem(key)) {
            alert("該食材已存在，請修改名稱！");
            return;
        }
        const food = {name, quantity, expiry, category};
        localStorage.setItem(key, JSON.stringify(food));
        alert(`已添加：\n名稱：${name}\n數量：${quantity}\n有效期限：${expiry}\n分類：${category}`);
        
        // 清空輸入框內容
        document.getElementById("name").value = '';
        document.getElementById("quantity").value = '';
        document.getElementById("expiry").value = '';
        document.getElementById("category").value = '';

        loadFood();
        popupBox.style.display = 'none'; // 添加完成後關閉懸浮窗
    } else {
        alert("請填寫所有必填項目！");
    }
}

export function deleteIngredient(key) {
    // 刪除食材邏輯
    const foodData = localStorage.getItem(key);

    if (!foodData) {
        alert('找不到該資料，可能已被刪除。');
        return;
    }

    try {
        const food = JSON.parse(foodData);
        if (!food || !food.name) throw new Error('資料格式錯誤');

        if (confirm(`確定要刪除「${food.name}」嗎？`)) {
            localStorage.removeItem(key);
            loadFood(); // 更新畫面
        }
    } catch (e) {
        alert('刪除失敗：資料格式不正確。');
        console.error(e);
    }
}
