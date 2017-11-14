
# 电话核对问题推荐

## 问题描述

* 背景：客户在我行办理贷款，信审员在收到客户的贷款申请后，会给客户拨打电话进行贷款信息的核实工作。
* 问题：目前，有经验的电核员会根据客户的基本情况，酌情进行问题的提问。没有经验的电核员则会根据话术逐条与客户进行问题的核对。
* 目标：利用机器学习的相关方法，为电核员推荐应该询问的问题。帮助没有经验的电核员提高工作效率。
* 已有数据：客户的贷款基本情况（结构化数据），电核员在电话后的报告（非结构化数据）
* 问题解决思路：由于电核员在电话核对后的报告为非结构化的数据，因此首先需要对非结构化的报告进行处理，采用NLP自然语言处理技术，提取报告的关键信息形成报告的标签，例如，收入情况，抵押物信息，婚姻状况等。每一个标签，可以由业务人员映射到不同的问题之上。由此，每个历史客户，我们都会有客户的贷款基本信息以及需要关注问题的标签。若有新客户到来，我们需要从历史客户的信息中匹配与该客户最为相似的几位客户，并提取这几名客户需要关注问题的标签，对这些标签进行加权统计，排出需要关注问题标签的优先级。

## 客户报告标签提取

* 利用snownlp对客户报告进行标签提取，并利用提取出的标签与实际问题进行关联。

提前把问题与关键词进行映射
例如：
* 借款人-借款人年龄大小？
* 负债-负债情况？
* 信用-是否存在违约？

* 映射后可以抽取出关键词列表如 （借款人、负债、信用）


```python
lable_list = {'借款人':'借款人年龄大小？', '负债':'负债情况？', '信用':'是否存在违约？','房产':'家庭资产状况？','经营':'企业经营状况'}
```

* 对文章进行nlp分析，分析出最相关的10个词


```python
from snownlp import SnowNLP
default_encoding="utf-8"
filesc = open('./贷款报告.txt','r')
text=filesc.read()
s = SnowNLP(text)
print('\033[1;34m')
print("段落内容：")
print('\033[1;30m')
print(text)
print('\033[1;34m')
print("段落关键词：")
print('\033[1;30m')
thiskey=s.keywords(30)
print(thiskey)
```

    [1;34m
    段落内容：
    [1;30m
    关于xxx申请x万元个人小额贷款的调查报告        
    一、借款人基本情况     
        1、借款人身份介绍      
        借款人xxx，女，42岁，身份证号码：xxxxxxxxxxx，家庭住址：xx省xx市xx区xx园210楼3门201室。配偶：xxx，身份证号码：xxxxxxxxxxx。二人自结婚以来，夫妻关系和睦，家庭生活稳定。现在xxxxxx水产品批发市场共同经营冷冻水产品生意，商户性质为个体工商户。
         借款人较早在我行开立结算账户，办理结算业务。持有、我行双币贷记卡、借记卡，存有定期储蓄存款。
        2、借款人资产负债状况
        借款人现拥有个人资产450万元,每年实现租金收入18万元。本市xx区别墅一套，占地面积208平方米，价值230万元（附房产证、土地证）；xx道步行街有商业门市房1套，建筑面积180平方米，价值220万元，现租给xx医院使用，合同租期为10年（2006.9.1-2016.8.31），年租金收入18万元(附产权证、土地证、租赁合同)。
        经查询《个人信用报告》，借款人在他行原有个人商用房贷款1笔，金额80万元，期限5年，现已结清，无不良纪录。
    二、借款人的经营状况
        借款人从1992年在xxx市场经营冷冻水产品生意，主要以批发带头虾、去头虾、虾肉为主，以供应饭店水产品为辅。在十几年的经营过程中，借款人诚信经营，形成了一定的业务规模，建立了稳定的进货渠道和销售渠道。其中批发客户35个，主要有大连的xxxxxx、xxxxxxx，沈阳的xxxxxx，秦皇岛的xxxxxxx。零售客户38个，主要有xx、xxx、xxx、xxx等。在xxx水产批发市场租用80平方米冷库两处，存货共20多个品种价值200多万元（详见库存清单）。从借款人提供的储蓄存折、银行卡等账户的业务流水计算，平均每月销售额为120万元，月净利润为10万元左右，现有职工8人。今年1-7月份已实现销售收入800万元，实现净利润70万元。
        其水产品进货渠道主要是北京、广东等地。这些产品销往我市xx、xxx、xxx、xxxxx等大型饭店、酒店及二级批发商。借款人所经营的冷冻水产品在我市规模较大，占据一定的市场份额，具有良好的信誉。
    三、借款人的财务状况
        借款人自90年代初在我行开立账户，办理结算业务，没有违约记录。由于借款人为个体工商户，纳税主要为定额税，年纳税1.2万元。故无法从借款人的财务数据上做具体分析，只能从其销货清单及进货单据来分析其具体经营状况。通过票据的具体查看，借款人依法经营，纳税及时。首先从今年前7个月的销售情况来看，已累计实现销售收入800万元，实现净利润70万元。其次从借款人签订的商业门市租赁合同查看，借款人每年实现租金收入18万元，这也是一笔比较稳定的收入。另外，根据其存货清单及实地调查，存货量约200多万元，结合经营水产品收益、租金收入，借款人每年创造效益130万元左右。以上数据可看出该借款人销售能力较强，具备还款能力。
    四、借款用途和原因
        借款主要用于采购水产品，增加商品库存量。由于水产品销售旺季较强。“十一”前后已经进入销售旺季。老客户的需求量稳定增长，新客户不断增加。2008年新增客户有xxx、xx等大、中型饭店、酒店。随着新客户的增加，需要增加购货量和库存量，计划采购各类水产品（主要为虾）150万元左右，借款人已自筹资金60万元，其余90万元从我行贷款解决，期限一年，以销售收入和利润偿还银行贷款本息。
    五、抵押物状况
        借款人以本人坐落于xx区xx道xx步行街2号的商用房产及土地使用权做为本笔贷款的抵押物。该房产是两层框架结构的临街商用房产，建成于2004年，建筑面积180平方米。房产证号：xx市房权证字第513050292号；设计用途：商业，产别：私有房产。土地使用权证号：xx国用（2005）第0028号；使用权面积：62平方米，用途：商业，使用权类型：出让，终止日期：2044年8月16日。抵押物临近xx道，地理位置优越，交通十分便利，升值速度较快，具备较强的变现能力。经xxxxxx房地产估价有限公司评估，评估时点房产现值：189.9万元，平均单价为10550元/平方米；评估时点土地现值：30.38万元，平均单价为4900元/平方米，房地产合计价值为220.28万元，抵押率40.86%，符合我行的贷款规定。
        该房产现出租给xxx使用，承租人用于经营xx医院。租期10年（2006年9月1日至2016年8月31日），年租金18万元，承租人同意我行处置该房产时放弃承租权。
    六、结论
        经调查，借款人xxx经营稳定、销售良好、为人正直、品德良好、具备偿还能力、第二还款来源也较为充足，并已在我行开立存款结算账户和xx借记卡账户，符合我行个人短期经营性贷款条件，同意向其发放贷款90万元，期限一年，利率执行基准利率上浮40%，即10.458％，按月付息、到期一次性偿还本金。发放此笔贷款可为我行增加利息收入90万元×10.458％=9.4万元，以商品销售收入及利润偿还借款本息，以xxx个人名下的商用房产及土地使用权做为本笔贷款的抵押物。
    [1;34m
    段落关键词：
    [1;30m
    ['万', '元', '借款人', '年', '销售', '房产', 'xx', '经营', '水产品', '我行', '贷款', '收入', '月', '号', '偿还', 'xxx', '平方米', '批发', '客户', '土地', '商用', '稳定', '市场', '使用权', '市', '已', '：xx', '饭店', '账户', '1']


* 把最相关的10个词与关键词列表进行匹配，反推出当时对用户询问的问题


```python
for i in thiskey:
    if i in lable_list:
        print(lable_list[i])
```

    借款人年龄大小？
    家庭资产状况？
    企业经营状况


* 记录每个已有客户最终提问的问题。

## 最相似客户查找

### 数据说明
* 由于目前无法拿到真实的客户的贷款信息，因此我们从“UCI Machine Learning Repository: Data Sets”中，找到了Bank Marketing Data Set作为客户信息的基础数据集进行测试。


### Bank Marketing Data Set 数据集说明
### Input variables:
#### bank client data:
1. age (numeric)
2. job : type of job (categorical: 'admin.','blue-collar','entrepreneur','housemaid','management','retired','self-employed','services','student','technician','unemployed','unknown')
3. marital : marital status (categorical: 'divorced','married','single','unknown'; note: 'divorced' means divorced or widowed)
4. education (categorical: 'basic.4y','basic.6y','basic.9y','high.school','illiterate','professional.course','university.degree','unknown')
5. default: has credit in default? (categorical: 'no','yes','unknown')
6. housing: has housing loan? (categorical: 'no','yes','unknown')
7. loan: has personal loan? (categorical: 'no','yes','unknown')
#### related with the last contact of the current campaign:
8. contact: contact communication type (categorical: 'cellular','telephone') 
9. month: last contact month of year (categorical: 'jan', 'feb', 'mar', ..., 'nov', 'dec')
10. day_of_week: last contact day of the week (categorical: 'mon','tue','wed','thu','fri')
11. duration: last contact duration, in seconds (numeric). Important note: this attribute highly affects the output target (e.g., if duration=0 then y='no'). Yet, the duration is not known before a call is performed. Also, after the end of the call y is obviously known. Thus, this input should only be included for benchmark purposes and should be discarded if the intention is to have a realistic predictive model.
#### other attributes:
12. campaign: number of contacts performed during this campaign and for this client (numeric, includes last contact)
13. pdays: number of days that passed by after the client was last contacted from a previous campaign (numeric; 999 means client was not previously contacted)
14. previous: number of contacts performed before this campaign and for this client (numeric)
15. poutcome: outcome of the previous marketing campaign (categorical: 'failure','nonexistent','success')
#### social and economic context attributes
16. emp.var.rate: employment variation rate quarterly indicator (numeric)
17. cons.price.idx: consumer price index monthly indicator (numeric) 
18. cons.conf.idx: consumer confidence index monthly indicator (numeric) 
19. euribor3m: euribor 3 month rate daily indicator (numeric)
20. nr.employed: number of employees quarterly indicator (numeric)

### 读取数据


```python
import pandas as pd
customer_info=pd.read_csv('./bank-additional-full.csv')
customer_info=customer_info.drop('y',axis=1)
customer_info.head(10)
```




<div>
<style>
    .dataframe thead tr:only-child th {
        text-align: right;
    }
    
    .dataframe thead th {
        text-align: left;
    }
    
    .dataframe tbody tr th {
        vertical-align: top;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>age</th>
      <th>job</th>
      <th>marital</th>
      <th>education</th>
      <th>default</th>
      <th>housing</th>
      <th>loan</th>
      <th>contact</th>
      <th>month</th>
      <th>day_of_week</th>
      <th>duration</th>
      <th>campaign</th>
      <th>pdays</th>
      <th>previous</th>
      <th>poutcome</th>
      <th>emp.var.rate</th>
      <th>cons.price.idx</th>
      <th>cons.conf.idx</th>
      <th>euribor3m</th>
      <th>nr.employed</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>56</td>
      <td>housemaid</td>
      <td>married</td>
      <td>basic.4y</td>
      <td>no</td>
      <td>no</td>
      <td>no</td>
      <td>telephone</td>
      <td>may</td>
      <td>mon</td>
      <td>261</td>
      <td>1</td>
      <td>999</td>
      <td>0</td>
      <td>nonexistent</td>
      <td>1.1</td>
      <td>93.994</td>
      <td>-36.4</td>
      <td>4.857</td>
      <td>5191.0</td>
    </tr>
    <tr>
      <th>1</th>
      <td>57</td>
      <td>services</td>
      <td>married</td>
      <td>high.school</td>
      <td>unknown</td>
      <td>no</td>
      <td>no</td>
      <td>telephone</td>
      <td>may</td>
      <td>mon</td>
      <td>149</td>
      <td>1</td>
      <td>999</td>
      <td>0</td>
      <td>nonexistent</td>
      <td>1.1</td>
      <td>93.994</td>
      <td>-36.4</td>
      <td>4.857</td>
      <td>5191.0</td>
    </tr>
    <tr>
      <th>2</th>
      <td>37</td>
      <td>services</td>
      <td>married</td>
      <td>high.school</td>
      <td>no</td>
      <td>yes</td>
      <td>no</td>
      <td>telephone</td>
      <td>may</td>
      <td>mon</td>
      <td>226</td>
      <td>1</td>
      <td>999</td>
      <td>0</td>
      <td>nonexistent</td>
      <td>1.1</td>
      <td>93.994</td>
      <td>-36.4</td>
      <td>4.857</td>
      <td>5191.0</td>
    </tr>
    <tr>
      <th>3</th>
      <td>40</td>
      <td>admin.</td>
      <td>married</td>
      <td>basic.6y</td>
      <td>no</td>
      <td>no</td>
      <td>no</td>
      <td>telephone</td>
      <td>may</td>
      <td>mon</td>
      <td>151</td>
      <td>1</td>
      <td>999</td>
      <td>0</td>
      <td>nonexistent</td>
      <td>1.1</td>
      <td>93.994</td>
      <td>-36.4</td>
      <td>4.857</td>
      <td>5191.0</td>
    </tr>
    <tr>
      <th>4</th>
      <td>56</td>
      <td>services</td>
      <td>married</td>
      <td>high.school</td>
      <td>no</td>
      <td>no</td>
      <td>yes</td>
      <td>telephone</td>
      <td>may</td>
      <td>mon</td>
      <td>307</td>
      <td>1</td>
      <td>999</td>
      <td>0</td>
      <td>nonexistent</td>
      <td>1.1</td>
      <td>93.994</td>
      <td>-36.4</td>
      <td>4.857</td>
      <td>5191.0</td>
    </tr>
    <tr>
      <th>5</th>
      <td>45</td>
      <td>services</td>
      <td>married</td>
      <td>basic.9y</td>
      <td>unknown</td>
      <td>no</td>
      <td>no</td>
      <td>telephone</td>
      <td>may</td>
      <td>mon</td>
      <td>198</td>
      <td>1</td>
      <td>999</td>
      <td>0</td>
      <td>nonexistent</td>
      <td>1.1</td>
      <td>93.994</td>
      <td>-36.4</td>
      <td>4.857</td>
      <td>5191.0</td>
    </tr>
    <tr>
      <th>6</th>
      <td>59</td>
      <td>admin.</td>
      <td>married</td>
      <td>professional.course</td>
      <td>no</td>
      <td>no</td>
      <td>no</td>
      <td>telephone</td>
      <td>may</td>
      <td>mon</td>
      <td>139</td>
      <td>1</td>
      <td>999</td>
      <td>0</td>
      <td>nonexistent</td>
      <td>1.1</td>
      <td>93.994</td>
      <td>-36.4</td>
      <td>4.857</td>
      <td>5191.0</td>
    </tr>
    <tr>
      <th>7</th>
      <td>41</td>
      <td>blue-collar</td>
      <td>married</td>
      <td>unknown</td>
      <td>unknown</td>
      <td>no</td>
      <td>no</td>
      <td>telephone</td>
      <td>may</td>
      <td>mon</td>
      <td>217</td>
      <td>1</td>
      <td>999</td>
      <td>0</td>
      <td>nonexistent</td>
      <td>1.1</td>
      <td>93.994</td>
      <td>-36.4</td>
      <td>4.857</td>
      <td>5191.0</td>
    </tr>
    <tr>
      <th>8</th>
      <td>24</td>
      <td>technician</td>
      <td>single</td>
      <td>professional.course</td>
      <td>no</td>
      <td>yes</td>
      <td>no</td>
      <td>telephone</td>
      <td>may</td>
      <td>mon</td>
      <td>380</td>
      <td>1</td>
      <td>999</td>
      <td>0</td>
      <td>nonexistent</td>
      <td>1.1</td>
      <td>93.994</td>
      <td>-36.4</td>
      <td>4.857</td>
      <td>5191.0</td>
    </tr>
    <tr>
      <th>9</th>
      <td>25</td>
      <td>services</td>
      <td>single</td>
      <td>high.school</td>
      <td>no</td>
      <td>yes</td>
      <td>no</td>
      <td>telephone</td>
      <td>may</td>
      <td>mon</td>
      <td>50</td>
      <td>1</td>
      <td>999</td>
      <td>0</td>
      <td>nonexistent</td>
      <td>1.1</td>
      <td>93.994</td>
      <td>-36.4</td>
      <td>4.857</td>
      <td>5191.0</td>
    </tr>
  </tbody>
</table>
</div>




```python
customer_info_test=pd.read_csv('./bank-additional.csv')
customer_info_test=customer_info_test.drop('y',axis=1)
customer_info_test.head(10)
```




<div>
<style>
    .dataframe thead tr:only-child th {
        text-align: right;
    }
    
    .dataframe thead th {
        text-align: left;
    }
    
    .dataframe tbody tr th {
        vertical-align: top;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>age</th>
      <th>job</th>
      <th>marital</th>
      <th>education</th>
      <th>default</th>
      <th>housing</th>
      <th>loan</th>
      <th>contact</th>
      <th>month</th>
      <th>day_of_week</th>
      <th>duration</th>
      <th>campaign</th>
      <th>pdays</th>
      <th>previous</th>
      <th>poutcome</th>
      <th>emp.var.rate</th>
      <th>cons.price.idx</th>
      <th>cons.conf.idx</th>
      <th>euribor3m</th>
      <th>nr.employed</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>30</td>
      <td>blue-collar</td>
      <td>married</td>
      <td>basic.9y</td>
      <td>no</td>
      <td>yes</td>
      <td>no</td>
      <td>cellular</td>
      <td>may</td>
      <td>fri</td>
      <td>487</td>
      <td>2</td>
      <td>999</td>
      <td>0</td>
      <td>nonexistent</td>
      <td>-1.8</td>
      <td>92.893</td>
      <td>-46.2</td>
      <td>1.313</td>
      <td>5099.1</td>
    </tr>
    <tr>
      <th>1</th>
      <td>39</td>
      <td>services</td>
      <td>single</td>
      <td>high.school</td>
      <td>no</td>
      <td>no</td>
      <td>no</td>
      <td>telephone</td>
      <td>may</td>
      <td>fri</td>
      <td>346</td>
      <td>4</td>
      <td>999</td>
      <td>0</td>
      <td>nonexistent</td>
      <td>1.1</td>
      <td>93.994</td>
      <td>-36.4</td>
      <td>4.855</td>
      <td>5191.0</td>
    </tr>
    <tr>
      <th>2</th>
      <td>25</td>
      <td>services</td>
      <td>married</td>
      <td>high.school</td>
      <td>no</td>
      <td>yes</td>
      <td>no</td>
      <td>telephone</td>
      <td>jun</td>
      <td>wed</td>
      <td>227</td>
      <td>1</td>
      <td>999</td>
      <td>0</td>
      <td>nonexistent</td>
      <td>1.4</td>
      <td>94.465</td>
      <td>-41.8</td>
      <td>4.962</td>
      <td>5228.1</td>
    </tr>
    <tr>
      <th>3</th>
      <td>38</td>
      <td>services</td>
      <td>married</td>
      <td>basic.9y</td>
      <td>no</td>
      <td>unknown</td>
      <td>unknown</td>
      <td>telephone</td>
      <td>jun</td>
      <td>fri</td>
      <td>17</td>
      <td>3</td>
      <td>999</td>
      <td>0</td>
      <td>nonexistent</td>
      <td>1.4</td>
      <td>94.465</td>
      <td>-41.8</td>
      <td>4.959</td>
      <td>5228.1</td>
    </tr>
    <tr>
      <th>4</th>
      <td>47</td>
      <td>admin.</td>
      <td>married</td>
      <td>university.degree</td>
      <td>no</td>
      <td>yes</td>
      <td>no</td>
      <td>cellular</td>
      <td>nov</td>
      <td>mon</td>
      <td>58</td>
      <td>1</td>
      <td>999</td>
      <td>0</td>
      <td>nonexistent</td>
      <td>-0.1</td>
      <td>93.200</td>
      <td>-42.0</td>
      <td>4.191</td>
      <td>5195.8</td>
    </tr>
    <tr>
      <th>5</th>
      <td>32</td>
      <td>services</td>
      <td>single</td>
      <td>university.degree</td>
      <td>no</td>
      <td>no</td>
      <td>no</td>
      <td>cellular</td>
      <td>sep</td>
      <td>thu</td>
      <td>128</td>
      <td>3</td>
      <td>999</td>
      <td>2</td>
      <td>failure</td>
      <td>-1.1</td>
      <td>94.199</td>
      <td>-37.5</td>
      <td>0.884</td>
      <td>4963.6</td>
    </tr>
    <tr>
      <th>6</th>
      <td>32</td>
      <td>admin.</td>
      <td>single</td>
      <td>university.degree</td>
      <td>no</td>
      <td>yes</td>
      <td>no</td>
      <td>cellular</td>
      <td>sep</td>
      <td>mon</td>
      <td>290</td>
      <td>4</td>
      <td>999</td>
      <td>0</td>
      <td>nonexistent</td>
      <td>-1.1</td>
      <td>94.199</td>
      <td>-37.5</td>
      <td>0.879</td>
      <td>4963.6</td>
    </tr>
    <tr>
      <th>7</th>
      <td>41</td>
      <td>entrepreneur</td>
      <td>married</td>
      <td>university.degree</td>
      <td>unknown</td>
      <td>yes</td>
      <td>no</td>
      <td>cellular</td>
      <td>nov</td>
      <td>mon</td>
      <td>44</td>
      <td>2</td>
      <td>999</td>
      <td>0</td>
      <td>nonexistent</td>
      <td>-0.1</td>
      <td>93.200</td>
      <td>-42.0</td>
      <td>4.191</td>
      <td>5195.8</td>
    </tr>
    <tr>
      <th>8</th>
      <td>31</td>
      <td>services</td>
      <td>divorced</td>
      <td>professional.course</td>
      <td>no</td>
      <td>no</td>
      <td>no</td>
      <td>cellular</td>
      <td>nov</td>
      <td>tue</td>
      <td>68</td>
      <td>1</td>
      <td>999</td>
      <td>1</td>
      <td>failure</td>
      <td>-0.1</td>
      <td>93.200</td>
      <td>-42.0</td>
      <td>4.153</td>
      <td>5195.8</td>
    </tr>
    <tr>
      <th>9</th>
      <td>35</td>
      <td>blue-collar</td>
      <td>married</td>
      <td>basic.9y</td>
      <td>unknown</td>
      <td>no</td>
      <td>no</td>
      <td>telephone</td>
      <td>may</td>
      <td>thu</td>
      <td>170</td>
      <td>1</td>
      <td>999</td>
      <td>0</td>
      <td>nonexistent</td>
      <td>1.1</td>
      <td>93.994</td>
      <td>-36.4</td>
      <td>4.855</td>
      <td>5191.0</td>
    </tr>
  </tbody>
</table>
</div>




```python
for i in customer_info.columns:
    if customer_info[i].dtypes=="object":
        Y2 = customer_info[i]
        Y3 = customer_info_test[i]
        S = set(Y2) 
        D = dict( zip(S, range(len(S))) ) # assign each string an integer, and put it in a dict
        print(D)
        Y = [D[Y2_] for Y2_ in Y2] # store class labels as ints
        Yt= [D[Y3_] for Y3_ in Y3] # store class labels as ints
        customer_info[i]=Y
        customer_info_test[i]=Yt
customer_info_test.tail(10)
```

    {'self-employed': 0, 'technician': 1, 'student': 2, 'unemployed': 3, 'retired': 4, 'unknown': 5, 'entrepreneur': 6, 'housemaid': 7, 'management': 8, 'blue-collar': 9, 'admin.': 10, 'services': 11}
    {'married': 0, 'single': 1, 'unknown': 2, 'divorced': 3}
    {'basic.9y': 0, 'unknown': 1, 'basic.6y': 2, 'university.degree': 3, 'basic.4y': 4, 'professional.course': 5, 'high.school': 6, 'illiterate': 7}
    {'unknown': 0, 'no': 1, 'yes': 2}
    {'unknown': 0, 'no': 1, 'yes': 2}
    {'unknown': 0, 'no': 1, 'yes': 2}
    {'cellular': 0, 'telephone': 1}
    {'sep': 0, 'oct': 1, 'jul': 2, 'dec': 3, 'aug': 4, 'apr': 5, 'mar': 6, 'may': 7, 'nov': 8, 'jun': 9}
    {'wed': 0, 'tue': 1, 'thu': 2, 'fri': 3, 'mon': 4}
    {'success': 0, 'nonexistent': 1, 'failure': 2}





<div>
<style>
    .dataframe thead tr:only-child th {
        text-align: right;
    }
    
    .dataframe thead th {
        text-align: left;
    }
    
    .dataframe tbody tr th {
        vertical-align: top;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>age</th>
      <th>job</th>
      <th>marital</th>
      <th>education</th>
      <th>default</th>
      <th>housing</th>
      <th>loan</th>
      <th>contact</th>
      <th>month</th>
      <th>day_of_week</th>
      <th>duration</th>
      <th>campaign</th>
      <th>pdays</th>
      <th>previous</th>
      <th>poutcome</th>
      <th>emp.var.rate</th>
      <th>cons.price.idx</th>
      <th>cons.conf.idx</th>
      <th>euribor3m</th>
      <th>nr.employed</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>4109</th>
      <td>63</td>
      <td>4</td>
      <td>0</td>
      <td>6</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>0</td>
      <td>1</td>
      <td>0</td>
      <td>1386</td>
      <td>1</td>
      <td>999</td>
      <td>0</td>
      <td>1</td>
      <td>-3.4</td>
      <td>92.431</td>
      <td>-26.9</td>
      <td>0.740</td>
      <td>5017.5</td>
    </tr>
    <tr>
      <th>4110</th>
      <td>53</td>
      <td>7</td>
      <td>3</td>
      <td>2</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>1</td>
      <td>7</td>
      <td>3</td>
      <td>85</td>
      <td>2</td>
      <td>999</td>
      <td>0</td>
      <td>1</td>
      <td>1.1</td>
      <td>93.994</td>
      <td>-36.4</td>
      <td>4.855</td>
      <td>5191.0</td>
    </tr>
    <tr>
      <th>4111</th>
      <td>30</td>
      <td>1</td>
      <td>0</td>
      <td>3</td>
      <td>1</td>
      <td>1</td>
      <td>2</td>
      <td>0</td>
      <td>9</td>
      <td>3</td>
      <td>131</td>
      <td>1</td>
      <td>999</td>
      <td>1</td>
      <td>2</td>
      <td>-1.7</td>
      <td>94.055</td>
      <td>-39.8</td>
      <td>0.748</td>
      <td>4991.6</td>
    </tr>
    <tr>
      <th>4112</th>
      <td>31</td>
      <td>1</td>
      <td>1</td>
      <td>5</td>
      <td>1</td>
      <td>2</td>
      <td>1</td>
      <td>0</td>
      <td>8</td>
      <td>2</td>
      <td>155</td>
      <td>1</td>
      <td>999</td>
      <td>0</td>
      <td>1</td>
      <td>-0.1</td>
      <td>93.200</td>
      <td>-42.0</td>
      <td>4.076</td>
      <td>5195.8</td>
    </tr>
    <tr>
      <th>4113</th>
      <td>31</td>
      <td>10</td>
      <td>1</td>
      <td>3</td>
      <td>1</td>
      <td>2</td>
      <td>1</td>
      <td>0</td>
      <td>8</td>
      <td>2</td>
      <td>463</td>
      <td>1</td>
      <td>999</td>
      <td>0</td>
      <td>1</td>
      <td>-0.1</td>
      <td>93.200</td>
      <td>-42.0</td>
      <td>4.076</td>
      <td>5195.8</td>
    </tr>
    <tr>
      <th>4114</th>
      <td>30</td>
      <td>10</td>
      <td>0</td>
      <td>2</td>
      <td>1</td>
      <td>2</td>
      <td>2</td>
      <td>0</td>
      <td>2</td>
      <td>2</td>
      <td>53</td>
      <td>1</td>
      <td>999</td>
      <td>0</td>
      <td>1</td>
      <td>1.4</td>
      <td>93.918</td>
      <td>-42.7</td>
      <td>4.958</td>
      <td>5228.1</td>
    </tr>
    <tr>
      <th>4115</th>
      <td>39</td>
      <td>10</td>
      <td>0</td>
      <td>6</td>
      <td>1</td>
      <td>2</td>
      <td>1</td>
      <td>1</td>
      <td>2</td>
      <td>3</td>
      <td>219</td>
      <td>1</td>
      <td>999</td>
      <td>0</td>
      <td>1</td>
      <td>1.4</td>
      <td>93.918</td>
      <td>-42.7</td>
      <td>4.959</td>
      <td>5228.1</td>
    </tr>
    <tr>
      <th>4116</th>
      <td>27</td>
      <td>2</td>
      <td>1</td>
      <td>6</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>0</td>
      <td>7</td>
      <td>4</td>
      <td>64</td>
      <td>2</td>
      <td>999</td>
      <td>1</td>
      <td>2</td>
      <td>-1.8</td>
      <td>92.893</td>
      <td>-46.2</td>
      <td>1.354</td>
      <td>5099.1</td>
    </tr>
    <tr>
      <th>4117</th>
      <td>58</td>
      <td>10</td>
      <td>0</td>
      <td>6</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>0</td>
      <td>4</td>
      <td>3</td>
      <td>528</td>
      <td>1</td>
      <td>999</td>
      <td>0</td>
      <td>1</td>
      <td>1.4</td>
      <td>93.444</td>
      <td>-36.1</td>
      <td>4.966</td>
      <td>5228.1</td>
    </tr>
    <tr>
      <th>4118</th>
      <td>34</td>
      <td>8</td>
      <td>1</td>
      <td>6</td>
      <td>1</td>
      <td>2</td>
      <td>1</td>
      <td>0</td>
      <td>8</td>
      <td>0</td>
      <td>175</td>
      <td>1</td>
      <td>999</td>
      <td>0</td>
      <td>1</td>
      <td>-0.1</td>
      <td>93.200</td>
      <td>-42.0</td>
      <td>4.120</td>
      <td>5195.8</td>
    </tr>
  </tbody>
</table>
</div>



### 利用KNN算法寻找最近邻的N个节点


```python
import numpy as np  
from sklearn import neighbors  
from sklearn.metrics import precision_recall_curve  
from sklearn.metrics import classification_report  
from sklearn.cross_validation import train_test_split  
import matplotlib.pyplot as plt  
```

    D:\ProgramData\Anaconda3\lib\site-packages\sklearn\cross_validation.py:41: DeprecationWarning: This module was deprecated in version 0.18 in favor of the model_selection module into which all the refactored classes and functions are moved. Also note that the interface of the new CV iterators are different from that of this module. This module will be removed in 0.20.
      "This module will be removed in 0.20.", DeprecationWarning)



```python
import numpy as np
from sklearn.neighbors import NearestNeighbors
X = customer_info
neigh  = NearestNeighbors(n_neighbors =5, metric='cosine')
neigh.fit(X)  
```




    NearestNeighbors(algorithm='auto', leaf_size=30, metric='cosine',
             metric_params=None, n_jobs=1, n_neighbors=5, p=2, radius=1.0)




```python
test_array=np.array(customer_info_test.iloc[1])
```


```python
print("与该客户最相似的客户号为：")
for i in neigh.kneighbors([test_array], 5, return_distance=False):
    print(i)
```

    与该客户最相似的客户号为：
    [1591  353 3315 5067 3640]


## 问题标签统计

* 由第3部，可得知与当前客户最为相似的客户，假设为a,b,c。
* 由第2部，可得知a,b,c三位用户询问的问题列表，a_list,b_list,c_list


```python
a_list=['借款人年龄？','借款人工资收入？','抵押物信息']
b_list=['抵押物信息','抵押物状态？']
c_list=['家庭负债情况','抵押物状态？']

```

* 统计出现频次最高的n个问题，作为该客户的备选问题


```python
sum_list=a_list+b_list+c_list
a = {}
for i in sum_list:
    a[i] = sum_list.count(i)
sortq=sorted(a.keys())
n=0
for i in sortq:
    n=n+1
    if n<=3:
        print(i)
```

    借款人工资收入？
    借款人年龄？
    家庭负债情况



```python

```

