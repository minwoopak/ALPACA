export const FileToName = {
  "../../static/data/3.exprs_agg_by_proteins/Brca_Basal_Tumor_Proteomics.exp.labeled": "Brca Basal Tumor Proteomics",
  "../../static/data/3.exprs_agg_by_proteins/Brca_Basal_Tumor_Transcriptomics.exp.labeled": "Brca Basal Tumor Transcriptomics",
  "../../static/data/3.exprs_agg_by_proteins/Brca_Her2_Tumor_Proteomics.exp.labeled": "Brca Her2 Tumor Proteomics",
  "../../static/data/3.exprs_agg_by_proteins/Brca_Her2_Tumor_Transcriptomics.exp.labeled": "Brca Her2 Tumor Transcriptomics",
  "../../static/data/3.exprs_agg_by_proteins/Brca_Luma_Tumor_Proteomics.exp.labeled": "Brca LumA Tumor Proteomics",
  "../../static/data/3.exprs_agg_by_proteins/Brca_Luma_Tumor_Transcriptomics.exp.labeled": "Brca LumA Tumor Transcriptomics",
  "../../static/data/3.exprs_agg_by_proteins/Brca_Lumb_Tumor_Proteomics.exp.labeled": "Brca LumB Tumor Proteomics",
  "../../static/data/3.exprs_agg_by_proteins/Brca_Lumb_Tumor_Transcriptomics.exp.labeled": "Brca LumB Tumor Transcriptomics",
  "../../static/data/3.exprs_agg_by_proteins/Brca_Normal-like_Tumor_Proteomics.exp.labeled": "Brca Normal-like Tumor Proteomics",
  "../../static/data/3.exprs_agg_by_proteins/Brca_Normal-like_Tumor_Transcriptomics.exp.labeled": "Brca Normal-like Tumor Transcriptomics",
  "../../static/data/3.exprs_agg_by_proteins/Brca_Tumor_Proteomics.exp.labeled": "Brca Tumor Proteomics",
  "../../static/data/3.exprs_agg_by_proteins/Brca_Tumor_Transcriptomics.exp.labeled": "Brca Tumor Transcriptomics",

  "../../static/data/3.exprs_agg_by_proteins/Ccrcc_Normal_Proteomics.exp.labeled": "Ccrcc Normal Proteomics",
  "../../static/data/3.exprs_agg_by_proteins/Ccrcc_Normal_Transcriptomics.exp.labeled": "Ccrcc Normal Transcriptomics",
  "../../static/data/3.exprs_agg_by_proteins/Ccrcc_Tumor_Proteomics.exp.labeled": "Ccrcc Tumor Proteomics",
  "../../static/data/3.exprs_agg_by_proteins/Ccrcc_Tumor_Transcriptomics.exp.labeled": "Ccrcc Tumor Transcriptomics",

  "../../static/data/3.exprs_agg_by_proteins/Colon_Normal_Proteomics.exp.labeled": "Colon Normal Proteomics",
  "../../static/data/3.exprs_agg_by_proteins/Colon_Tumor_Proteomics.exp.labeled": "Colon Tumor Proteomics",
  "../../static/data/3.exprs_agg_by_proteins/Colon_Tumor_Transcriptomics.exp.labeled": "Colon Tumor Transcriptomics",

  "../../static/data/3.exprs_agg_by_proteins/Endometrial_Normal_Proteomics.exp.labeled": "Endometrial Normal Proteomics",
  "../../static/data/3.exprs_agg_by_proteins/Endometrial_Normal_Transcriptomics.exp.labeled": "Endometrial Normal Transcriptomics",
  "../../static/data/3.exprs_agg_by_proteins/Endometrial_Tumor_Proteomics.exp.labeled": "Endometrial Tumor Proteomics",
  "../../static/data/3.exprs_agg_by_proteins/Endometrial_Tumor_Transcriptomics.exp.labeled": "Endometrial Tumor Transcriptomics",

  "../../static/data/3.exprs_agg_by_proteins/Gbm_Normal_Proteomics.exp.labeled": "Gbm Normal Proteomics",
  // "../../static/data/3.exprs_agg_by_proteins/Gbm_Normal_Transcriptomics.exp.labeled": "Gbm Normal Transcriptomics",
  "../../static/data/3.exprs_agg_by_proteins/Gbm_Tumor_Proteomics.exp.labeled": "Gbm Tumor Proteomics",
  // "../../static/data/3.exprs_agg_by_proteins/Gbm_Tumor_Transcriptomics.exp.labeled": "Gbm Tumor Transcriptomics",

  "../../static/data/3.exprs_agg_by_proteins/Luad_Normal_Proteomics.exp.labeled": "Luad Normal Proteomics",
  "../../static/data/3.exprs_agg_by_proteins/Luad_Normal_Transcriptomics.exp.labeled": "Luad Normal Transcriptomics",
  "../../static/data/3.exprs_agg_by_proteins/Luad_Tumor_Proteomics.exp.labeled": "Luad Tumor Proteomics",
  "../../static/data/3.exprs_agg_by_proteins/Luad_Tumor_Transcriptomics.exp.labeled": "Luad Tumor Transcriptomics",

  "../../static/data/3.exprs_agg_by_proteins/Ovarian_Normal_Proteomics.exp.labeled": "Ovarian Normal Proteomics",
  "../../static/data/3.exprs_agg_by_proteins/Ovarian_Tumor_Proteomics.exp.labeled": "Ovarian Tumor Proteomics",
  "../../static/data/3.exprs_agg_by_proteins/Ovarian_Tumor_Transcriptomics.exp.labeled": "Ovarian Tumor Transcriptomics",
};

export const sampleDatasetList = [];
for (const fileName in FileToName){
  const dataName = FileToName[fileName];
  const element = {
    dataName, fileName
  }
  sampleDatasetList.push(element)
};