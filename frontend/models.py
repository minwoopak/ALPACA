from django.db import models

class DataUpload(models.Model):
    datafile = models.FileField(upload_to='data/%Y/%m/%d')
