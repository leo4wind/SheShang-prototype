
<map>
  <node ID="root" TEXT="人民蛇伤模块">
    <node TEXT="专病库模块（内网pc）" ID="cc8cf30c56b1cba57650615ceabcf077" STYLE="bubble" POSITION="right">
      <node TEXT="对接旧专病库v1" ID="e7e3c901aa188d8214ad2c11b519fb73" STYLE="fork"/>
      <node TEXT="对接医院内HIS、LIS（化验，检验）、PACS（影像）、120等系统获取数据v2" ID="b47132954c8f5aea0b08a55c24c5338b" STYLE="fork"/>
      <node TEXT="数据治理v3" ID="ed335f1c792a4025e6e85d66d27b8927" STYLE="fork">
        <node TEXT="数据落库" ID="a4f6208670bcb776ca4b4f734c2e1837" STYLE="fork">
          <node TEXT="1.结构化数据" ID="15076c40e59c1a77184479a84da210dd" STYLE="fork"/>
          <node TEXT="2.半结构化数据" ID="c9c5dc57720fe997aa716e3ece20437a" STYLE="fork"/>
          <node TEXT="3.非结构化数据" ID="d1c7a57456cb8e5c30857523b1ceaebc" STYLE="fork"/>
        </node>
        <node TEXT="数据清洗" ID="a8b7b7f76adc66acc5f997759103ff12" STYLE="fork">
          <node TEXT="去重，格式化" ID="5182c525bd80e2ad0227112db2b08308" STYLE="fork"/>
          <node TEXT="基本校验，非法值过滤，数据映射" ID="2bf7256e02806a95b0c8917f6dc33c72" STYLE="fork"/>
          <node TEXT="变量分级、类别转变量、记录合并、多选转单选、缺失值填补、变量拆分等" ID="56dad2868e08242827d2349f37045129" STYLE="fork"/>
        </node>
        <node TEXT="脱敏" ID="de34e11dd77be973506f19b1a441f662" STYLE="fork"/>
        <node TEXT="结构化映射" ID="f061a467041cf8947a012e0a30bc2094" STYLE="fork">
          <node TEXT="按要求进行标准编码映射整合" ID="f5deb7a05773667a25984dbf40f20f22" STYLE="fork"/>
          <node TEXT="非结构化NLP处理" ID="db3b8cdb0c4a7f28dfd0d849c0da2394" STYLE="fork"/>
        </node>
        <node TEXT="数据质量控制" ID="342100e8f940a573487d093dda4ccbc5" STYLE="fork">
          <node TEXT="自动校验" ID="0431946cc51c739cb927897920f7dd54" STYLE="fork">
            <node TEXT="逻辑性检查" ID="57436d0df2005acc88b7344d5f8bc2f0" STYLE="fork"/>
            <node TEXT="配置校验（血压为负数）" ID="5e36b93358a4e0a417a308f297b216b7" STYLE="fork"/>
          </node>
          <node TEXT="人工校验" ID="7d0c873cca9de1ada32736626be50283" STYLE="fork">
            <node TEXT="质疑，答疑" ID="32e57cd371f0e156cef9a392e6482969" STYLE="fork"/>
            <node TEXT="审核" ID="8e6470ef58e0b2892ced25b846ecdcd7" STYLE="fork"/>
            <node TEXT="锁定" ID="ed7fb3cd2fadefd33f31f5ebe7ad4272" STYLE="fork"/>
          </node>
        </node>
      </node>
      <node TEXT="多维度查询导出v2" ID="c042ae85c5f447085a25933f621c6f09" STYLE="fork"/>
      <node TEXT="统计分析v2" ID="f75ae94c74e42c713f5a8679853c32a6" STYLE="fork"/>
      <node TEXT="大屏v3" ID="2af71d9ac86c97002aad8c4935a524e1" STYLE="fork"/>
      <node TEXT="患者主索引，患者360，时间线串联v2" ID="b22e19c51c17ae0c03fdaef32e3da996" STYLE="fork"/>
      <node TEXT="随访模块v3" ID="2e0f26f33f3f551d1df1aad166e93ce2" STYLE="fork"/>
      <node TEXT="科研CRF模块v3" ID="268fde476b57f98d7e53589fb27e2c01" STYLE="fork"/>
    </node>
    <node TEXT="质控模块（医生端PC/APP）" ID="ececb7bd86f55622260c689398b4cd42" STYLE="bubble" POSITION="right">
      <node TEXT="培训v2" ID="11977df5066b1adebc63f25ce373e86a" STYLE="fork">
        <node TEXT="知识辅助指导（医生-&gt;医生）" ID="faa6c8fde5846d19f0dd29a8f0341924" STYLE="fork">
          <node TEXT="资料上传和查看" ID="eb20195ca539ebb00fc1889df9372738" STYLE="fork"/>
        </node>
      </node>
      <node TEXT="救助v1" ID="b6b0594598e692f1104dd78df1573631" STYLE="fork">
        <node TEXT="远程查看小程序端病人端的数据，人工确定病症，推送到病人端" ID="17f70a6de1206b1a7d6f626d8eeeae6d" STYLE="fork"/>
      </node>
      <node TEXT="蛇伤判定标准v2" ID="25080ad82330339044ce3f776f357c9f" STYLE="fork">
        <node TEXT="图像识别" ID="f01d0cf5628e0655b9ddb702ad53baf8" STYLE="fork"/>
        <node TEXT="agent给出初诊建议，治疗方案" ID="c7fc730be9d5abfa97f59bc6565979e1" STYLE="fork"/>
        <node TEXT="医生参考agent，给出实际方案，并记录到就诊记录" ID="4d79a3e38f718699e8e1dbb106b80731" STYLE="fork"/>
      </node>
    </node>
    <node TEXT="病人应急求救模块（患者端小程序）" ID="9f3809ae000d4d1dbb89368311dfedd6" STYLE="bubble" POSITION="right">
      <node TEXT="根据资质和血清库存就近显示医院v1" ID="6abe9552162b4d355694eeca1c21cb37" STYLE="fork">
        <node TEXT="对接地图SDK" ID="0f6f9c70ea2a8813201d34835641fb99" STYLE="fork"/>
        <node TEXT="维护医院和资质" ID="8bdee2840a1f86ab69f657f1483e9c38" STYLE="fork"/>
        <node TEXT="血清库存从赛伦生物获取" ID="d4975d1eb3697a938fd1d45b9b4c4354" STYLE="fork"/>
        <node TEXT="弱网情况下电话或短信兜底" ID="d2d4535589d25346982a949c3437988f" STYLE="fork"/>
      </node>
      <node TEXT="基础信息上报v1" ID="6a0f9acfe53790b92b66fb2acd49afaa" STYLE="fork">
        <node TEXT="口述现场情况，大体症状，地点" ID="d3eabf47587f191673d02ac33b0dca9b" STYLE="fork"/>
        <node TEXT="自救措施，时间描述" ID="83ea7ba4616626d8ed30c3e805c85f9a" STYLE="fork"/>
        <node TEXT="地点，图片（蛇，伤口）" ID="7bb21cb4df0fb7155096f1af3df2beed" STYLE="fork"/>
      </node>
      <node TEXT="消息推送，随访c端推送，填写表单v2" ID="2830de50c273a1c36b36c73dc819484e" STYLE="fork"/>
      <node TEXT="查看自己的就诊信息v1" ID="ae4dbaed5e8af8116408cc0788e4c906" STYLE="fork"/>
      <node TEXT="医生互动v2" ID="f1ff13c5b873b1c016e59c50e96dac46" STYLE="fork"/>
    </node>
    <node TEXT="多中心分诊模块（医生端APP）" ID="3247d5982c33601e1c990941823b59db" STYLE="bubble" POSITION="right">
      <node TEXT="转诊v1" ID="b6deebec1f4a210625275216fa4f80c7" STYLE="fork"/>
      <node TEXT="MDT（多学科会诊）v1" ID="f8aae111177c0e1f9ac8343eec3ac880" STYLE="fork"/>
      <node TEXT="共享患者v1" ID="71007816ca1f9f85294a58ed96334add" STYLE="fork"/>
      <node TEXT="权限管理v1" ID="00876391c63935b5e002710890fb1760" STYLE="fork"/>
    </node>
    <node TEXT="健康陪护模块（患者端小程序）" ID="ae7de43cf880a224a53f76450f0a4c17" STYLE="bubble" POSITION="right">
      <node TEXT="复查提醒v1" ID="af5ea5b6593d6a8ac3e9dfaa6082348c" STYLE="fork"/>
      <node TEXT="用药打卡v1" ID="a4ad028130452a77b342fd58660979ab" STYLE="fork"/>
      <node TEXT="对话收集信息v1" ID="ba292145540d22a8072550eb6b2f198b" STYLE="fork"/>
      <node TEXT="定时推送随访表单、问卷给病人v2" ID="1b7ed5763c598587bc831fcb6a4fdb4b" STYLE="fork"/>
      <node TEXT="收集日常的数据信息v2" ID="eef298bd4b27431467a51906fe76132d" STYLE="fork"/>
      <node TEXT="知识推送v2" ID="34024fb8d992e44d3d4f300933543e07" STYLE="fork"/>
    </node>
    <node TEXT="问题记录" ID="f04086f2fa2f0ee9920e3c8a3a234817" STYLE="bubble" POSITION="right">
      <node TEXT="内网外网数据能否混用，因为我们有c端" ID="d591486363c472019953ca45720cfc54" STYLE="fork">
        <node TEXT="对接接口" ID="5f5c78f6336ab78258abd63dd4d21d73" STYLE="fork"/>
        <node TEXT="推送，etl" ID="f985df17e33d11974ece57722e477b07" STYLE="fork"/>
        <node TEXT="脱敏" ID="72b1ac137baf1bd32b5fa37c1b3f29af" STYLE="fork"/>
        <node TEXT="隔离" ID="d876632d3a3a70f91596c0a892ffaeb1" STYLE="fork"/>
      </node>
      <node TEXT="大模型AI功能实现起来会有一些难度" ID="9c4018025fad5d6c7cc124ab3f6c49b4" STYLE="fork">
        <node TEXT="对接外部的api" ID="3cddc12cc7fe803609d527ace46fb706" STYLE="fork"/>
        <node TEXT="自己部署服务，训练模型，收集数据，测试正确率" ID="87ebb89fa954beb228e8f1f4194b9a3d" STYLE="fork"/>
      </node>
    </node>
  </node>
</map>