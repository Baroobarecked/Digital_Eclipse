import os, json, boto3, uuid
from flask import Blueprint, request
from flask_login import login_required

from ..models import db, Album, Song

upload_routes = Blueprint('uploads', __name__, url_prefix='/api/uploads')

@upload_routes.route('', methods=['POST'])
def uploadFile():
    S3_BUCKET = os.environ.get('BUCKETEER_BUCKET_NAME')

    s3 = boto3.client('s3',
        aws_access_key_id = os.environ.get('BUCKETEER_AWS_ACCESS_KEY_ID'),
        aws_secret_access_key = os.environ.get('BUCKETEER_AWS_SECRET_ACCESS_KEY'),
        region_name = os.environ.get('BUCKETEER_AWS_REGION')
    )

    data = request.json['file']
    file_name = data[0]
    file_type = data[1]
    print(data)


    file_name = file_name.replace(' ', '')

    file_name = f'{uuid.uuid4()}{file_name}'


    presigned_post = s3.generate_presigned_post(
        Bucket = S3_BUCKET,
        Key = f'{file_name}',
        Fields = {"acl": "public-read", "Content-Type": file_type},
        Conditions = [
            {"acl": "public-read"},
            {"Content-Type": file_type}
        ],
        ExpiresIn = 3600
    )

    print('https://%s.s3.amazonaws.com/%s' % (S3_BUCKET, file_name))

    return json.dumps({
        'data': presigned_post,
        'url': 'https://%s.s3.amazonaws.com/%s' % (S3_BUCKET, file_name)
    })

    # S3_BUCKET = os.environ.get('S3_BUCKET')

    # file_name = request.args.get('file_name')
    # file_type = request.args.get('file_type')

    # print('.................')
    # print(file_name)
    # print(file_type)
    # s3 = boto3.client('s3',
    #     aws_access_key_id = os.environ.get('AWS_ACCESS_KEY_ID'),
    #     aws_secret_access_key = os.environ.get('AWS_SECRET_ACCESS_KEY'),
    #     region_name='us-east-2'
    # )

    # presigned_post = s3.generate_presigned_post(
    #     Bucket = S3_BUCKET,
    #     Key = file_name,
    #     Fields = {"acl": "public-read", "Content-Type": file_type},
    #     Conditions = [
    #     {"acl": "public-read"},
    #     {"Content-Type": file_type}
    #     ],
    #     ExpiresIn = 3600
    # )

    # return json.dumps({
    #     'data': presigned_post,
    #     'url': 'https://%s.s3.amazonaws.com/%s' % (S3_BUCKET, file_name)
    # })
